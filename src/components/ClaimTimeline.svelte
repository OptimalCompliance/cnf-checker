<script lang="ts">
    import { getTimelineInfo } from '../lib/timelineUtils';
    import type { Period } from '../lib/cnfCheckerLogic';

    // Accept the currentState as a prop
    export let currentState: Record<number, unknown>;

    // Extract period from currentState
    $: period = getPeriodFromState(currentState);
    $: timelineInfo = period ? getTimelineInfo(period) : null;

    // Function to extract period from state
    function getPeriodFromState(state: Record<number, unknown>): Period | null {
        // Check for direct period selection (from company house flow)
        if (state[3] && typeof state[3] === 'object' && 'start' in (state[3] as object) && 'end' in (state[3] as object)) {
            return state[3] as Period;
        }
        
        // Check for manually entered dates
        if (state[4] && state[5] && typeof state[4] === 'string' && typeof state[5] === 'string') {
            return {
                start: state[4],
                end: state[5]
            };
        }
        
        return null;
    }

    // Format date for display
    function formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    }
</script>

{#if timelineInfo}
<div class="mt-6 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
    <h3 class="text-lg font-semibold mb-3">Claim Timeline (work in progress by AI)</h3>
    
    <div class="relative pt-10 pb-6">
        <!-- Timeline bar -->
        <div class="absolute h-2 bg-gray-300 top-16 left-0 right-0 z-0"></div>
        
        <!-- Timeline points -->
        <div class="relative z-10 flex justify-between">
            <!-- Accounting Period Start -->
            <div class="flex flex-col items-center">
                <div class="w-4 h-4 bg-blue-500 rounded-full mb-1"></div>
                <div class="text-sm font-medium">Period Start</div>
                <div class="text-xs">{formatDate(timelineInfo.accountingPeriod.start)}</div>
            </div>
            
            <!-- CNF Requirement Date (April 1, 2023) -->
            <div class="flex flex-col items-center">
                <div class="w-4 h-4 bg-red-500 rounded-full mb-1"></div>
                <div class="text-sm font-medium">CNF Requirement</div>
                <div class="text-xs">{formatDate(timelineInfo.cnfRequirementDate)}</div>
            </div>
            
            <!-- Accounting Period End -->
            <div class="flex flex-col items-center">
                <div class="w-4 h-4 bg-blue-500 rounded-full mb-1"></div>
                <div class="text-sm font-medium">Period End</div>
                <div class="text-xs">{formatDate(timelineInfo.accountingPeriod.end)}</div>
            </div>
            
            <!-- Notification Period End (Deadline) -->
            <div class="flex flex-col items-center">
                <div class="w-4 h-4 bg-green-500 rounded-full mb-1"></div>
                <div class="text-sm font-medium">Notification Deadline</div>
                <div class="text-xs">{formatDate(timelineInfo.notificationPeriod.end)}</div>
            </div>
        </div>
        
        <!-- Period indicators -->
        <div class="mt-8 flex flex-col gap-2">
            <!-- Accounting Period -->
            <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-blue-500 rounded-sm"></div>
                <div class="text-sm">
                    <span class="font-medium">Accounting Period:</span> 
                    {formatDate(timelineInfo.accountingPeriod.start)} to {formatDate(timelineInfo.accountingPeriod.end)}
                </div>
            </div>
            
            <!-- Notification Period -->
            <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-green-500 rounded-sm"></div>
                <div class="text-sm">
                    <span class="font-medium">Notification Period:</span> 
                    {formatDate(timelineInfo.notificationPeriod.start)} to {formatDate(timelineInfo.notificationPeriod.end)}
                </div>
            </div>
            
            <!-- CNF Requirement Status -->
            <div class="mt-2 p-2 rounded {timelineInfo.isCnfRequiredByStartDate ? 'bg-yellow-100' : 'bg-green-100'}">
                <div class="text-sm">
                    {#if timelineInfo.isCnfRequiredByStartDate}
                        <span class="font-medium">Note:</span> This accounting period starts on or after April 1, 2023, 
                        so a CNF may be required (subject to other conditions).
                    {:else}
                        <span class="font-medium">Note:</span> This accounting period starts before April 1, 2023, 
                        so a CNF is not required based on the start date.
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>
{/if}