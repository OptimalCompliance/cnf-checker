<script lang="ts">
    import { getTimelineInfo } from '../lib/timelineUtils';
    import type { Period } from '../lib/cnfCheckerLogic';

    // Accept the currentState as a prop
    export let currentState: Record<number, unknown>;

    // Extract period from currentState
    $: period = getPeriodFromState(currentState);
    $: timelineInfo = period ? getTimelineInfo(period) : null;

    // SVG dimensions and margins
    const width = 800;
    const height = 200;
    const margin = { top: 40, right: 40, bottom: 60, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Timeline scale and rendering functions
    $: timelineData = timelineInfo ? calculateTimelineData(timelineInfo) : null;

    function calculateTimelineData(info) {
        // Get all relevant dates
        const dates = [
            new Date(info.accountingPeriod.start),
            new Date(info.accountingPeriod.end),
            new Date(info.notificationPeriod.end),
            new Date(info.cnfRequirementDate)
        ];

        // Find min and max dates (add buffer of 1 month on each side)
        const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

        minDate.setMonth(minDate.getMonth() - 1);
        maxDate.setMonth(maxDate.getMonth() + 1);

        // Set to start of month for min and end of month for max
        minDate.setDate(1);
        maxDate.setDate(0); // Last day of previous month
        maxDate.setMonth(maxDate.getMonth() + 2); // Move to end of next month

        // Generate months between min and max dates
        const months = [];
        const currentDate = new Date(minDate);

        while (currentDate <= maxDate) {
            months.push(new Date(currentDate));
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        // Generate years for major tick marks
        const years = [];
        const startYear = minDate.getFullYear();
        const endYear = maxDate.getFullYear();

        for (let year = startYear; year <= endYear; year++) {
            years.push(year);
        }

        // Scale function to map dates to x positions
        const timeScale = (date) => {
            const totalTime = maxDate.getTime() - minDate.getTime();
            const dateTime = date.getTime() - minDate.getTime();
            return (dateTime / totalTime) * innerWidth;
        };

        return {
            minDate,
            maxDate,
            months,
            years,
            timeScale,
            info
        };
    }

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

    // Format month for display on tick marks
    function formatMonth(date: Date): string {
        return date.toLocaleDateString('en-GB', { month: 'short' });
    }

    // Format year for display on tick marks
    function formatYear(year: number): string {
        return year.toString();
    }
</script>

{#if timelineInfo && timelineData}
<div class="mt-6 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
    <h3 class="text-lg font-semibold mb-3">Claim Timeline</h3>

    <div class="relative">
        <!-- SVG Timeline -->
        <svg viewBox="0 0 {width} {height}" width="100%" height={height}>
            <g transform="translate({margin.left}, {margin.top})">
                <!-- Timeline axis -->
                <line 
                    x1="0" 
                    y1={innerHeight / 2} 
                    x2={innerWidth} 
                    y2={innerHeight / 2} 
                    stroke="#CBD5E0" 
                    stroke-width="2" 
                />

                <!-- Month tick marks -->
                {#each timelineData.months as month}
                    <line 
                        x1={timelineData.timeScale(month)} 
                        y1={innerHeight / 2 - 5} 
                        x2={timelineData.timeScale(month)} 
                        y2={innerHeight / 2 + 5} 
                        stroke="#718096" 
                        stroke-width="1" 
                    />
                    <!-- Only show month labels for first month of each quarter to avoid crowding -->
                    {#if month.getMonth() % 3 === 0}
                        <text 
                            x={timelineData.timeScale(month)} 
                            y={innerHeight / 2 + 20} 
                            text-anchor="middle" 
                            font-size="10" 
                            fill="#4A5568"
                        >
                            {formatMonth(month)}
                        </text>
                    {/if}
                {/each}

                <!-- Year tick marks -->
                {#each timelineData.years as year}
                    <!-- Find first month of the year -->
                    {@const yearDate = new Date(year, 0, 1)}
                    {#if yearDate >= timelineData.minDate && yearDate <= timelineData.maxDate}
                        <line 
                            x1={timelineData.timeScale(yearDate)} 
                            y1={innerHeight / 2 - 10} 
                            x2={timelineData.timeScale(yearDate)} 
                            y2={innerHeight / 2 + 10} 
                            stroke="#2D3748" 
                            stroke-width="2" 
                        />
                        <text 
                            x={timelineData.timeScale(yearDate)} 
                            y={innerHeight / 2 + 35} 
                            text-anchor="middle" 
                            font-size="12" 
                            font-weight="bold" 
                            fill="#2D3748"
                        >
                            {formatYear(year)}
                        </text>
                    {/if}
                {/each}

                <!-- Claim period highlight -->
                <rect 
                    x={timelineData.timeScale(new Date(timelineData.info.accountingPeriod.start))} 
                    y={innerHeight / 2 - 15} 
                    width={timelineData.timeScale(new Date(timelineData.info.accountingPeriod.end)) - 
                           timelineData.timeScale(new Date(timelineData.info.accountingPeriod.start))} 
                    height="30" 
                    fill="#BEE3F8" 
                    opacity="0.5" 
                    rx="3" 
                />

                <!-- Key date markers -->
                <!-- Accounting Period Start -->
                <circle 
                    cx={timelineData.timeScale(new Date(timelineData.info.accountingPeriod.start))} 
                    cy={innerHeight / 2} 
                    r="6" 
                    fill="#3182CE" 
                />
                <text 
                    x={timelineData.timeScale(new Date(timelineData.info.accountingPeriod.start))} 
                    y={innerHeight / 2 - 25} 
                    text-anchor="middle" 
                    font-size="11" 
                    fill="#2D3748"
                >
                    Period Start
                </text>
                <text 
                    x={timelineData.timeScale(new Date(timelineData.info.accountingPeriod.start))} 
                    y={innerHeight / 2 - 10} 
                    text-anchor="middle" 
                    font-size="10" 
                    fill="#4A5568"
                >
                    {formatDate(timelineData.info.accountingPeriod.start)}
                </text>

                <!-- CNF Requirement Date -->
                <circle 
                    cx={timelineData.timeScale(new Date(timelineData.info.cnfRequirementDate))} 
                    cy={innerHeight / 2} 
                    r="6" 
                    fill="#E53E3E" 
                />
                <text 
                    x={timelineData.timeScale(new Date(timelineData.info.cnfRequirementDate))} 
                    y={innerHeight / 2 - 25} 
                    text-anchor="middle" 
                    font-size="11" 
                    fill="#2D3748"
                >
                    CNF Requirement
                </text>
                <text 
                    x={timelineData.timeScale(new Date(timelineData.info.cnfRequirementDate))} 
                    y={innerHeight / 2 - 10} 
                    text-anchor="middle" 
                    font-size="10" 
                    fill="#4A5568"
                >
                    {formatDate(timelineData.info.cnfRequirementDate)}
                </text>

                <!-- Accounting Period End -->
                <circle 
                    cx={timelineData.timeScale(new Date(timelineData.info.accountingPeriod.end))} 
                    cy={innerHeight / 2} 
                    r="6" 
                    fill="#3182CE" 
                />
                <text 
                    x={timelineData.timeScale(new Date(timelineData.info.accountingPeriod.end))} 
                    y={innerHeight / 2 - 25} 
                    text-anchor="middle" 
                    font-size="11" 
                    fill="#2D3748"
                >
                    Period End
                </text>
                <text 
                    x={timelineData.timeScale(new Date(timelineData.info.accountingPeriod.end))} 
                    y={innerHeight / 2 - 10} 
                    text-anchor="middle" 
                    font-size="10" 
                    fill="#4A5568"
                >
                    {formatDate(timelineData.info.accountingPeriod.end)}
                </text>

                <!-- Notification Deadline -->
                <circle 
                    cx={timelineData.timeScale(new Date(timelineData.info.notificationPeriod.end))} 
                    cy={innerHeight / 2} 
                    r="6" 
                    fill="#38A169" 
                />
                <text 
                    x={timelineData.timeScale(new Date(timelineData.info.notificationPeriod.end))} 
                    y={innerHeight / 2 - 25} 
                    text-anchor="middle" 
                    font-size="11" 
                    fill="#2D3748"
                >
                    Notification Deadline
                </text>
                <text 
                    x={timelineData.timeScale(new Date(timelineData.info.notificationPeriod.end))} 
                    y={innerHeight / 2 - 10} 
                    text-anchor="middle" 
                    font-size="10" 
                    fill="#4A5568"
                >
                    {formatDate(timelineData.info.notificationPeriod.end)}
                </text>
            </g>
        </svg>

        <!-- Period indicators -->
        <div class="mt-4 flex flex-col gap-2">
            <!-- Accounting Period -->
            <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-blue-500 rounded-sm"></div>
                <div class="text-sm">
                    <span class="font-medium">Accounting Period:</span> 
                    {formatDate(timelineInfo.accountingPeriod.start)} to {formatDate(timelineInfo.accountingPeriod.end)}
                </div>
            </div>

            <!-- Notification Deadline -->
            <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-green-500 rounded-sm"></div>
                <div class="text-sm">
                    <span class="font-medium">Notification Deadline:</span> 
                    {formatDate(timelineInfo.notificationPeriod.end)}
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
