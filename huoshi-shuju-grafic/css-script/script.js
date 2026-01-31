
        // ===== 夜晚/白天切换 =====
        const themeBtn = document.getElementById("themeToggle");
        themeBtn.addEventListener("click", () => {
            const isDay = document.body.classList.toggle("day");

            // 动态修改图表颜色
            economyChart.data.datasets[0].borderColor = isDay ? "#000000" : "#00e5ff";
            economyChart.data.datasets[0].backgroundColor = isDay ? "rgba(0,0,0,0.1)" : "rgba(0,229,255,0.18)";
            economyChart.options.plugins.legend.labels.color = isDay ? "#000000" : "#ffffff";
            economyChart.options.scales.x.ticks.color = isDay ? "#111111" : "#aaaaaa";
            economyChart.options.scales.x.grid.color = isDay ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";
            economyChart.options.scales.y.ticks.color = isDay ? "#111111" : "#aaaaaa";
            economyChart.options.scales.y.grid.color = isDay ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";

            economyChart.update();
        });


        // ===== 原始数据与统计逻辑 =====
        const economyData = [
            { date: "2025-01-01", number: 200 },
            { date: "2025-05-01", number: 1305 },
            { date: "2025-05-05", number: 1280 },
            { date: "2025-05-09", number: 1260 },
            { date: "2025-05-13", number: 1340 },
            { date: "2025-05-17", number: 1260 },
            { date: "2025-05-21", number: 1290 },
            { date: "2025-05-25", number: 1270 },
            { date: "2025-05-29", number: 1320 },
            { date: "2025-06-02", number: 1370 },
            { date: "2025-06-06", number: 1395 },
            { date: "2025-06-10", number: 1445 },
            { date: "2025-06-14", number: 1485 },
            { date: "2025-06-18", number: 1535 },
            { date: "2025-06-22", number: 1590 },
            { date: "2025-06-26", number: 1585 },
            { date: "2025-07-01", number: 1655 },
            { date: "2025-07-08", number: 1675 },
            { date: "2025-07-15", number: 1770 },
            { date: "2025-07-22", number: 2225 },
            { date: "2025-07-26", number: 3000 },
            { date: "2025-08-02", number: 3040 },
            { date: "2025-10-01", number: 3400 },
            { date: "2025-11-01", number: 3560 },
            { date: "2025-12-01", number: 3400 },
            { date: "2025-12-14", number: 3150 },
            { date: "2026-01-10", number: 3270 },
            { date: "2026-01-11", number: 3290 },
            { date: "2026-01-13", number: 3310 },
            { date: "2026-01-15", number: 3320 },       
            { date: "2026-01-26", number: 3330 },
            { date: "2026-01-27", number: 3670 }
        ];

        function updateStats() {
            const values = economyData.map(i => i.number);
            const dates = economyData.map(i => new Date(i.date));

            let totalUp = 0, totalDown = 0, maxIncrease = 0, maxDecrease = 0;
            let upStreak = 0, downStreak = 0, maxUp = 0, maxDown = 0;
            let peak = values[0], maxDrawdown = 0;

            for (let i = 1; i < values.length; i++) {
                const diff = values[i] - values[i - 1];
                if (diff > 0) {
                    totalUp += diff;
                    maxIncrease = Math.max(maxIncrease, diff);
                    upStreak++; downStreak = 0;
                } else {
                    totalDown += Math.abs(diff);
                    maxDecrease = Math.max(maxDecrease, Math.abs(diff));
                    downStreak++; upStreak = 0;
                }
                maxUp = Math.max(maxUp, upStreak);
                maxDown = Math.max(maxDown, downStreak);
                peak = Math.max(peak, values[i]);
                maxDrawdown = Math.max(maxDrawdown, peak - values[i]);
            }

            const days = (dates.at(-1) - dates[0]) / 86400000;
            const avgDaily = (values.at(-1) - values[0]) / days;
            const avgMonthly = avgDaily * 30;
            const growthRate = ((values.at(-1) - values[0]) / values[0] * 100).toFixed(2);

            const now = dates.at(-1);
            const past30 = economyData.find(i => (now - new Date(i.date)) / 86400000 <= 30);
            const growth30 = past30
                ? (((values.at(-1) - past30.number) / past30.number) * 100).toFixed(2)
                : "N/A";

            document.getElementById("currentMoney").innerText = values.at(-1);
            document.getElementById("maxMoney").innerText = Math.max(...values);
            document.getElementById("totalUp").innerText = totalUp;
            document.getElementById("totalDown").innerText = totalDown;
            document.getElementById("maxIncrease").innerText = maxIncrease;
            document.getElementById("maxDecrease").innerText = maxDecrease;
            document.getElementById("recordCount").innerText = values.length;
            document.getElementById("avgDaily").innerText = avgDaily.toFixed(2);
            document.getElementById("avgMonthly").innerText = avgMonthly.toFixed(0);
            document.getElementById("maxDrawdown").innerText = "-" + maxDrawdown;
            document.getElementById("growthRate").innerText = growthRate + "%";
            document.getElementById("growth30").innerText = growth30 + "%";
            document.getElementById("maxUpStreak").innerText = maxUp;
            document.getElementById("maxDownStreak").innerText = maxDown;

            const lastDiff = values.at(-1) - values.at(-2);
            document.getElementById("trend").innerText =
                lastDiff > 0 ? "上涨" : lastDiff < 0 ? "下跌" : "平稳";
        }

        updateStats();

        // ===== 图表保持不变 =====
        const ctx = document.getElementById("economyChart").getContext("2d");
        const economyChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: economyData.map(i => i.date),
                datasets: [{
                    label: "经济 / 资产变化",
                    data: economyData.map(i => i.number),
                    borderColor: "#00e5ff",
                    backgroundColor: "rgba(0,229,255,0.18)",
                    fill: true,
                    tension: 0.25,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointBackgroundColor: "#ffffff"
                }]
            },
            options: {
                responsive: true,
                interaction: { mode: "index", intersect: false },
                plugins: {
                    legend: { labels: { color: "#ffffff" } },
                    zoom: {
                        pan: { enabled: true, mode: "xy" },
                        zoom: {
                            wheel: { enabled: true, modifierKey: "ctrl" },
                            pinch: { enabled: true },
                            mode: "xy"
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label(context) {
                                const i = context.dataIndex;
                                if (i === 0) return `金额: ${context.raw}`;
                                const prev = economyData[i - 1].number;
                                const diff = context.raw - prev;
                                const percent = ((diff / prev) * 100).toFixed(2);
                                return `金额: ${context.raw} (${diff >= 0 ? "+" : ""}${diff}, ${percent}%)`;
                            }
                        }
                    }
                },
                scales: {
                    x: { ticks: { color: "#aaaaaa" }, grid: { color: "rgba(255,255,255,0.06)" } },
                    y: { ticks: { color: "#aaaaaa" }, grid: { color: "rgba(255,255,255,0.06)" } }
                }
            }
        });

        

        // ===== 获取欧元人民币汇率（使用 Frankfurter API） =====
async function fetchEURCNY() {
    try {
        const res = await fetch("https://api.frankfurter.dev/v1/latest?base=EUR&symbols=CNY");
        const data = await res.json();

        const rate = data.rates.CNY ? parseFloat(data.rates.CNY) : null;

        if (rate) {
            // 更新欧元汇率显示
            document.getElementById("eurCnyRate").innerText = rate.toFixed(4);

            // 计算总兑换人民币
            const currentEuro = economyData.at(-1).number;
            const totalCNY = (currentEuro * rate).toFixed(2);
            document.getElementById("totalCNY").innerText = totalCNY + " ¥";
        } else {
            document.getElementById("eurCnyRate").innerText = "无数据";
            document.getElementById("totalCNY").innerText = "无数据";
        }
    } catch (e) {
        document.getElementById("eurCnyRate").innerText = "获取失败";
        document.getElementById("totalCNY").innerText = "获取失败";
        console.error("EUR/CNY 获取失败", e);
    }
}

// 初始化并每小时更新一次
fetchEURCNY();
setInterval(fetchEURCNY, 3600000);





