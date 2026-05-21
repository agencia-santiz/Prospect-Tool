import React, { useEffect } from 'react';
import { firebaseDataConnect, isDataConnectSyncEnabled } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { 
    listQueuedEnrichmentJobs, 
    updateEnrichmentJobStatus,
    listStaleDeals,
    listStaleLeads,
    upsertEnrichmentJob,
    upsertDeal,
    upsertLead,
    upsertCompany
} from '@dataconnect/generated';

const JOB_POLL_INTERVAL_MS = 10000; // Check every 10 seconds
const TTL_CHECK_INTERVAL_MS = 60000 * 60; // Check every hour
const DEAL_TTL_DAYS = 30; // 30 days TTL for enrichment
const LEAD_TTL_DAYS = 30; // 30 days TTL for saved leads

export const JobWorker: React.FC = () => {
    const { workspace, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated || !workspace || !isDataConnectSyncEnabled || !firebaseDataConnect) return;

        let isPolling = false;

        const pollJobs = async () => {
            if (isPolling) return;
            isPolling = true;

            try {
                const response = await listQueuedEnrichmentJobs(firebaseDataConnect, {
                    workspaceId: workspace.id
                });
                
                const jobs = response.data.enrichmentJobs;

                for (const job of jobs) {
                    await updateEnrichmentJobStatus(firebaseDataConnect, {
                        id: job.id,
                        status: 'running',
                        result: {},
                        errorMessage: null
                    });

                    try {
                        // SIMULATE HEAVY PROCESSING
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        
                        const fakeResult = {
                            enrichedAt: new Date().toISOString(),
                            score: Math.floor(Math.random() * 100),
                            website: "https://example.com/" + job.id.substring(0, 5),
                            phone: "+55 11 99999-9999"
                        };

                        if (job.jobType === 'refresh_deal' && job.payload?.dealId) {
                            // Find the deal to preserve history
                            const staleDealsRes = await listStaleDeals(firebaseDataConnect, {
                                workspaceId: workspace.id,
                                staleDate: new Date().toISOString() // get all just to find it, or we should use a getDeal query
                            });
                            const targetDeal = staleDealsRes.data.deals.find((d: any) => d.id === job.payload.dealId);
                            
                            if (targetDeal) {
                                const currentPayload = targetDeal.payload || {};
                                const mergedPayload = {
                                    ...currentPayload,
                                    contactInfo: {
                                        ...(currentPayload.contactInfo || {}),
                                        website: fakeResult.website,
                                        phone: fakeResult.phone
                                    },
                                    lastEnrichedAt: fakeResult.enrichedAt
                                };

                                await upsertDeal(firebaseDataConnect, {
                                    id: targetDeal.id,
                                    workspaceId: workspace.id,
                                    pipelineId: targetDeal.pipeline.id,
                                    stageId: targetDeal.stage.id,
                                    title: targetDeal.title,
                                    companyId: targetDeal.company?.id || null,
                                    value: targetDeal.value,
                                    priority: targetDeal.priority,
                                    nextStep: currentPayload.nextStep || null,
                                    notes: currentPayload.notes || null,
                                    payload: mergedPayload
                                });
                            }
                        }

                        if (job.jobType === 'refresh_lead' && job.payload?.leadId) {
                            // Re-enrich the company data behind this lead
                            const companyId = job.payload.companyId;
                            if (companyId) {
                                const refreshedCompanyData: Record<string, any> = {
                                    phone: fakeResult.phone,
                                    website: fakeResult.website,
                                };

                                // Merge new data into the company
                                await upsertCompany(firebaseDataConnect, {
                                    id: companyId,
                                    workspaceId: workspace.id,
                                    legalName: job.payload.tradeName || 'N/A',
                                    tradeName: job.payload.tradeName || 'N/A',
                                    segment: job.payload.segment || 'Desconhecido',
                                    city: job.payload.city || '',
                                    region: job.payload.region || '',
                                    country: 'BR',
                                    phone: refreshedCompanyData.phone,
                                    website: refreshedCompanyData.website,
                                });

                                // Touch the lead to update its timestamp and score
                                await upsertLead(firebaseDataConnect, {
                                    id: job.payload.leadId,
                                    workspaceId: workspace.id,
                                    companyId: companyId,
                                    status: job.payload.status || 'NEW',
                                    rank: 0,
                                    score: fakeResult.score,
                                    source: job.payload.source || 'GOOGLE_MAPS',
                                });
                            }
                        }

                        await updateEnrichmentJobStatus(firebaseDataConnect, {
                            id: job.id,
                            status: 'completed',
                            result: fakeResult,
                            errorMessage: null
                        });
                    } catch (error: any) {
                        await updateEnrichmentJobStatus(firebaseDataConnect, {
                            id: job.id,
                            status: 'failed',
                            result: {},
                            errorMessage: error.message || "Failed to process job"
                        });
                    }
                }
            } catch (err) {
                console.error("Job worker error:", err);
            } finally {
                isPolling = false;
            }
        };

        const checkStaleData = async () => {
            try {
                const staleDate = new Date();
                staleDate.setDate(staleDate.getDate() - DEAL_TTL_DAYS);
                
                const staleResponse = await listStaleDeals(firebaseDataConnect, {
                    workspaceId: workspace.id,
                    staleDate: staleDate.toISOString()
                });

                for (const deal of staleResponse.data.deals) {
                    // Create an enrichment job for each stale deal
                    await upsertEnrichmentJob(firebaseDataConnect, {
                        id: crypto.randomUUID(),
                        workspaceId: workspace.id,
                        companyId: deal.company?.id || null,
                        jobType: 'refresh_deal',
                        payload: { dealId: deal.id }
                    });
                    
                    // Touching the deal to prevent infinite loop of queuing
                    await upsertDeal(firebaseDataConnect, {
                        id: deal.id,
                        workspaceId: workspace.id,
                        pipelineId: deal.pipeline.id,
                        stageId: deal.stage.id,
                        title: deal.title,
                        companyId: deal.company?.id || null,
                        value: deal.value,
                        priority: deal.priority,
                        nextStep: null,
                        notes: null,
                        payload: { ...(deal.payload || {}), lastRefreshQueuedAt: new Date().toISOString() }
                    });
                }
            } catch (error) {
                console.error("Failed to queue stale deal refresh", error);
            }
        };

        const checkStaleLeads = async () => {
            try {
                const staleDate = new Date();
                staleDate.setDate(staleDate.getDate() - LEAD_TTL_DAYS);

                const staleLeadsResponse = await listStaleLeads(firebaseDataConnect, {
                    workspaceId: workspace.id,
                    staleDate: staleDate.toISOString()
                });

                for (const lead of staleLeadsResponse.data.leads) {
                    // Queue a refresh_lead enrichment job for each stale lead
                    await upsertEnrichmentJob(firebaseDataConnect, {
                        id: crypto.randomUUID(),
                        workspaceId: workspace.id,
                        companyId: lead.company?.id || null,
                        jobType: 'refresh_lead',
                        payload: {
                            leadId: lead.id,
                            companyId: lead.company?.id || null,
                            tradeName: lead.company?.tradeName || '',
                            segment: lead.company?.segment || '',
                            city: lead.company?.city || '',
                            region: lead.company?.region || '',
                            status: lead.status,
                            source: lead.source,
                        }
                    });

                    // Touch the lead to prevent re-queueing on next cycle
                    await upsertLead(firebaseDataConnect, {
                        id: lead.id,
                        workspaceId: workspace.id,
                        companyId: lead.company?.id || '',
                        status: lead.status,
                        rank: 0,
                        score: lead.score || 0,
                        source: lead.source || 'GOOGLE_MAPS',
                    });
                }

                if (staleLeadsResponse.data.leads.length > 0) {
                    console.info(`[JobWorker] Queued refresh for ${staleLeadsResponse.data.leads.length} stale lead(s).`);
                }
            } catch (error) {
                console.error("Failed to queue stale lead refresh", error);
            }
        };

        const intervalId = setInterval(pollJobs, JOB_POLL_INTERVAL_MS);
        const ttlIntervalId = setInterval(() => {
            checkStaleData();
            checkStaleLeads();
        }, TTL_CHECK_INTERVAL_MS);
        
        pollJobs();
        checkStaleData();
        checkStaleLeads();

        return () => {
            clearInterval(intervalId);
            clearInterval(ttlIntervalId);
        };
    }, [isAuthenticated, workspace]);

    return null;
};
