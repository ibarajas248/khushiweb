 if (typeof ApexCharts !== "undefined") {
                    // Patrimonio (área)
                    if (!document.getElementById('area').children.length) {
                        var areaOptions = {
                            chart: { type: 'area', height: 250 },
                            series: [{
                                name: 'Patrimonio',
                                data: [111111, 105000, 110000, 120000, 125000, 130000, 140000, 145000, 150000]
                            }],
                            xaxis: {
                                categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep']
                            }
                        };
                        new ApexCharts(document.querySelector("#area"), areaOptions).render();
                    }

                    // Activos vs Pasivos (radial)
                    if (!document.getElementById('radialGradient').children.length) {
                        var radialOptions = {
                            chart: { type: 'radialBar', height: 250 },
                            series: [60], // 60% activos vs 40% pasivos
                            labels: ['Activos (%)']
                        };
                        new ApexCharts(document.querySelector("#radialGradient"), radialOptions).render();
                    }
                    var optionsProduccion = {
                        chart: { type: 'area', height: 250 },
                        series: [
                            { name: 'Programado', data: [100, 120, 130, 150, 160] },
                            { name: 'Real', data: [90, 100, 110, 140, 150] }
                            
                        ],
                        xaxis: { categories: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] }
                    };
                    new ApexCharts(document.querySelector("#produccionArea"), optionsProduccion).render();


                    // Ganancias mensuales (línea)
                    if (!document.getElementById('line').children.length) {
                        var lineOptions = {
                            chart: { type: 'line', height: 250 },
                            series: [{
                                name: 'Ganancias',
                                data: [3000, 4000, 3500, 5000, 6000, 5800, 200]
                            }],
                            xaxis: {
                                categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul']
                            }
                        };
                        new ApexCharts(document.querySelector("#line"), lineOptions).render();
                    }
                    var optionsOperario = {
                        chart: { type: 'donut', height: 250 },
                        series: [120, 95, 140, 110],
                        labels: ['Lucía', 'Carlos', 'Andrea', 'Pedro']
                    };
                    new ApexCharts(document.querySelector("#prendasOperario"), optionsOperario).render();

                    if (!document.getElementById('donut').children.length) {
                        var donutOptions = {
                            chart: { type: 'donut', height: 250 },
                            labels: ['Ventas', 'Inversiones', 'Servicios', 'Otros'],
                            series: [45000, 25000, 15000, 5000]
                        };
                        new ApexCharts(document.querySelector("#donut"), donutOptions).render();
                    }
                    if (!document.getElementById('stackedArea').children.length) {
                        var stackedAreaOptions = {
                            chart: { type: 'area', stacked: true, height: 250 },
                            series: [
                                { name: 'Activos', data: [30000, 35000, 40000, 45000, 50000] },
                                { name: 'Pasivos', data: [10000, 15000, 18000, 20000, 21000] }
                            ],
                            xaxis: {
                                categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May']
                            }
                        };
                        new ApexCharts(document.querySelector("#stackedArea"), stackedAreaOptions).render();
                    }
                    var optionsHeatmap = {
                        chart: { type: 'heatmap', height: 250 },
                        series: [
                            {
                                name: 'Corte',
                                data: [{ x: 'Operación 1', y: 5 }, { x: 'Operación 2', y: 7 }]
                            },
                            {
                                name: 'Confección',
                                data: [{ x: 'Operación 1', y: 12 }, { x: 'Operación 2', y: 9 }]
                            }
                        ],
                        dataLabels: { enabled: false },
                        xaxis: { type: 'category' }
                    };
                    new ApexCharts(document.querySelector("#tiempoOperacion"), optionsHeatmap).render();

                    if (!document.getElementById('heatmap').children.length) {
                        var heatmapOptions = {
                            chart: { type: 'heatmap', height: 300 },
                            series: [
                                {
                                    name: 'Ventas',
                                    data: [80, 90, 70, 60, 100]
                                },
                                {
                                    name: 'Producción',
                                    data: [60, 50, 65, 70, 55]
                                },
                                {
                                    name: 'Logística',
                                    data: [75, 85, 80, 95, 90]
                                }
                            ],
                            xaxis: {
                                categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May']
                            }
                        };
                        new ApexCharts(document.querySelector("#heatmap"), heatmapOptions).render();
                    }




                    // Pérdidas por área (barra)
                    if (!document.getElementById('bar').children.length) {
                        var barOptions = {
                            chart: { type: 'bar', height: 250 },
                            series: [{
                                name: 'Pérdidas',
                                data: [1500, 1000, 2000, 800, 1200]
                            }],
                            xaxis: {
                                categories: ['Producción', 'Logística', 'Marketing', 'Ventas', 'Administración']
                            }
                        };
                        new ApexCharts(document.querySelector("#bar"), barOptions).render();
                    }

                    if (!document.getElementById('tiempoPromedioOperacion').children.length) {
                        var optionsTiempoPromedio = {
                            chart: {
                                type: 'bar',
                                height: 300,
                                toolbar: { show: false }
                            },
                            plotOptions: {
                                bar: {
                                    distributed: true,
                                    horizontal: false,
                                    columnWidth: '55%',
                                    endingShape: 'rounded'
                                }
                            },
                            dataLabels: { enabled: true },
                            series: [{
                                name: 'Tiempo promedio (min)',
                                data: [3.5, 5.2, 4.0, 6.1, 2.8, 4.7]  // <-- puedes reemplazar con tus valores reales
                            }],
                            xaxis: {
                                categories: ['Corte', 'Costura', 'Terminación', 'Control Calidad', 'Empaque', 'Etiquetado'],
                                title: { text: 'Operación' }
                            },
                            yaxis: {
                                title: { text: 'Minutos' }
                            },
                            colors: ['#00E396', '#FEB019', '#FF4560', '#775DD0', '#008FFB', '#00D9E9']
                        };

                        new ApexCharts(document.querySelector("#tiempoPromedioOperacion"), optionsTiempoPromedio).render();
                    }


                    // Gráfico tipo velas financieras (candlestick)
                } // <-- Cierra el if (typeof ApexCharts !== "undefined")