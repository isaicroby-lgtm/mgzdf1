"use client";

import React, { useEffect, useState } from "react";
import { Row, Col, Table, Select, Input, Button, Form, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { fetchStats } from "@/redux/stats/actionCreator";
import { Main, TableWrapper } from "@/components/style";
import theme from "@/components/atoms/theme";
import Cards from "@/components/atoms/Cards";
import Heading from "@/components/atoms/Heading";
import ChartjsBarChartTransparent from "@/components/atoms/Chart/chart";

import { fetchExpenses, updateExpenses } from "@/api/cheltuieli";
import { CardBarChart2, EChartCard } from "./style";
import { toLower } from "lodash";
import { encodeURL } from "@/utility/urlFormatting";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const calculateRaise = (firstNumber, secondNumber) => {
  return Number((firstNumber - secondNumber).toFixed(2));
};

const numberWithCommas = (number) => {
  if (number) return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const mostPopularProductsColumns = [
  {
    title: "Nume produs",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => b.name?.localeCompare(a.name),
  },

  {
    title: "Pret",
    dataIndex: "price",
    key: "price",
    sorter: (a, b) => b.price - a.price,
  },

  {
    title: "Nr. bucati vandute",
    dataIndex: "numberOfTimesBought",
    key: "numberOfTimesBought",
    sorter: (a, b) => b.numberOfTimesBought - a.numberOfTimesBought,
  },
  {
    title: "Nr. bucati in stoc",
    dataIndex: "stock",
    key: "stock",
    sorter: (a, b) => b.stock - a.stock,
  },
  {
    title: "Nr. vizualizari",
    dataIndex: "views",
    key: "views",
    sorter: (a, b) => b.views - a.views,
  },
];

const chartOptions = {
  maintainAspectRatio: true,
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },

  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },

  scales: {
    x: {
      ticks: {
        display: false,
      },

      grid: {
        drawBorder: false,
        display: false,
      },
    },

    y: {
      ticks: {
        display: false,
        beginAtZero: true,
      },

      grid: {
        drawBorder: false,
        display: false,
      },
    },
  },
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [monthlyData, setMonthlyData] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [loadingMonthly, setLoadingMonthly] = useState(true);
  const [expenses, setExpenses] = useState({});
  const [editingExpense, setEditingExpense] = useState(null);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  
  const {
    sources,
    weekOrdersCount,
    weekOrdersCountTrecut,
    venit,
    venitTrecut,
    totalProfit,
    totalProfitTrecut,
    avg,
    avgTrecut,
    useri,
    useriTrecut,
    mostPopularProducts,
    conversionRate,
    conversionRatePast,
    sourcesPast,
  } = useSelector((state) => {
    const products = state.products?.productsAll;

    const userSourcesPast = state.stats.lastMonth?.userSources || [];

    const viewsMap = new Map();
    if (state?.stats?.pageViews)
      for (const view of state?.stats?.pageViews) {
        const n = toLower(encodeURIComponent(view.page));
        viewsMap.set(n, (viewsMap.get(n) || 0) + view.views);
      }

    const facebookPast = {
      users: 0,
      sessions: 0,
    };
    const direct_urlPast = {
      users: 0,
      sessions: 0,
    };
    const googlePast = {
      users: 0,
      sessions: 0,
    };
    const necunoscutPast = {
      users: 0,
      sessions: 0,
    };
    const youtubePast = {
      users: 0,
      sessions: 0,
    };
    const altelePast = {
      users: 0,
      sessions: 0,
    };

    for (const source of userSourcesPast) {
      if (source.source.includes("facebook")) {
        facebookPast.sessions += source.sessions;
        facebookPast.users += source.users;
      } else if (source.source.includes("direct")) {
        direct_urlPast.sessions += source.sessions;
        direct_urlPast.users += source.users;
      } else if (source.source.includes("not set")) {
        necunoscutPast.sessions += source.sessions;
        necunoscutPast.users += source.users;
      } else if (source.source.includes("youtube")) {
        youtubePast.sessions += source.sessions;
        youtubePast.users += source.users;
      } else if (source.source.includes("google")) {
        googlePast.sessions += source.sessions;
        googlePast.users += source.users;
      } else {
        necunoscutPast.sessions += source.sessions;
        necunoscutPast.users += source.users;
      }
    }

    const userSources = state.stats.currentMonth?.userSources || [];

    const facebook = {
      users: 0,
      sessions: 0,
    };
    const direct_url = {
      users: 0,
      sessions: 0,
    };
    const google = {
      users: 0,
      sessions: 0,
    };
    const necunoscut = {
      users: 0,
      sessions: 0,
    };
    const youtube = {
      users: 0,
      sessions: 0,
    };
    const altele = {
      users: 0,
      sessions: 0,
    };

    for (const source of userSources) {
      if (source.source.includes("facebook")) {
        facebook.sessions += source.sessions;
        facebook.users += source.users;
      } else if (source.source.includes("direct")) {
        direct_url.sessions += source.sessions;
        direct_url.users += source.users;
      } else if (source.source.includes("not set")) {
        necunoscut.sessions += source.sessions;
        necunoscut.users += source.users;
      } else if (source.source.includes("youtube")) {
        youtube.sessions += source.sessions;
        youtube.users += source.users;
      } else if (source.source.includes("google")) {
        google.sessions += source.sessions;
        google.users += source.users;
      } else {
        necunoscut.sessions += source.sessions;
        necunoscut.users += source.users;
      }
    }

    return {
      sources: {
        facebook,
        direct_url,
        google,
        youtube,
        necunoscut,
        altele,
      },
      sourcesPast: {
        facebookPast,
        direct_urlPast,
        googlePast,
        youtubePast,
        necunoscutPast,
        altelePast,
      },
      conversionRate: state.stats.currentMonth?.conversionRate?.toFixed(2),
      conversionRatePast: state.stats.lastMonth?.conversionRate?.toFixed(2),
      weekOrdersCount: state.stats.weekOrdersCount,
      weekOrdersCountTrecut: state.stats.weekOrdersCountTrecut,
      venit: state.stats.venit ? Number(state.stats.venit).toFixed(2) : "0.00",
      venitTrecut: state.stats.venitTrecut ? Number(state.stats.venitTrecut).toFixed(2) : "0.00",
      totalProfit: state.stats.totalProfit ? Number(state.stats.totalProfit).toFixed(2) : "0.00",
      totalProfitTrecut: state.stats.totalProfitTrecut ? Number(state.stats.totalProfitTrecut).toFixed(2) : "0.00",
      avg: state.stats.avg ? Number(state.stats.avg).toFixed(2) : "0.00",
      avgTrecut: state.stats.avgTrecut ? Number(state.stats.avgTrecut).toFixed(2) : "0.00",
      useri: state.stats.useri,
      useriTrecut: state.stats.useriTrecut,
      mostPopularProducts:
        products
          ?.filter((a) => a.numberOfTimesBought)
          ?.sort((a, b) => {
            return b.numberOfTimesBought - a.numberOfTimesBought;
          })
          ?.map((x) => ({
            ...x,
            key: x.id,
            views: viewsMap.get(toLower(x.encoded_url)),
          })) || [],
    };
  });

  useEffect(() => {
    dispatch(fetchStats());
    fetchMonthlyData();
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoadingExpenses(true);
    try {
      const expensesData = await fetchExpenses();
      setExpenses(expensesData);
    } catch (error) {
      console.error("Error loading expenses:", error);
    } finally {
      setLoadingExpenses(false);
    }
  };

  const handleUpdateExpense = async (name, value) => {
    try {
      const updatedExpenses = { ...expenses, [name]: parseFloat(value) };
      await updateExpenses(updatedExpenses);
      setExpenses(updatedExpenses);
      setEditingExpense(null);
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const handleAddExpense = async () => {
    if (!newExpenseName || !newExpenseAmount) return;
    
    try {
      const updatedExpenses = { 
        ...expenses, 
        [newExpenseName]: parseFloat(newExpenseAmount) 
      };
      await updateExpenses(updatedExpenses);
      setExpenses(updatedExpenses);
      setNewExpenseName('');
      setNewExpenseAmount('');
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleDeleteExpense = async (name) => {
    try {
      // Create a copy of the current expenses
      const updatedExpenses = { ...expenses };
      
      // Delete the expense from the copy
      delete updatedExpenses[name];
      
      // Update the backend first
      await updateExpenses(updatedExpenses);
      console.log(JSON.stringify(updatedExpenses))
      // Only update the frontend state if the backend update succeeds
      setExpenses(updatedExpenses);
      await updateExpenses(updatedExpenses);
      
    } catch (error) {
      console.error("Error deleting expense:", error);
      // You might want to show an error message to the user here
    }
  };

  // Calculate total expenses
  const totalExpenses = Object.values(expenses).reduce((sum, amount) => sum + amount, 0);
  const profitAfterExpenses = parseFloat(totalProfit) - totalExpenses;
  const fetchMonthlyData = async () => {
    try {
      setLoadingMonthly(true);
      // This would be replaced with your actual API call to get monthly data
      // For now, I'll simulate data based on your existing stats
      const months = [
        { month: '01/2023', revenue: 15000, profit: 5000 },
        { month: '02/2023', revenue: 18000, profit: 6000 },
        { month: '03/2023', revenue: 22000, profit: 8000 },
        { month: '04/2023', revenue: 25000, profit: 9000 },
        { month: '05/2023', revenue: 28000, profit: 10000 },
        { month: '06/2023', revenue: 30000, profit: 11000 },
      ];
      
      setMonthlyData(months);
      setAvailableMonths(months.map(m => m.month));
      setSelectedMonths(months.map(m => m.month));
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    } finally {
      setLoadingMonthly(false);
    }
  };

  const monthlyChartData = {
    labels: monthlyData.filter(d => selectedMonths.includes(d.month)).map(d => d.month),
    datasets: [
      {
        label: 'Venit (RON)',
        data: monthlyData.filter(d => selectedMonths.includes(d.month)).map(d => d.revenue),
        borderColor: '#5F63F2',
        backgroundColor: 'rgba(95, 99, 242, 0.2)',
        tension: 0.1
      },
      {
        label: 'Profit (RON)',
        data: monthlyData.filter(d => selectedMonths.includes(d.month)).map(d => d.profit),
        borderColor: '#FF69A5',
        backgroundColor: 'rgba(255, 105, 165, 0.2)',
        tension: 0.1
      }
    ]
  };

  const monthlyChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Evoluția Venitului și Profitului',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sumă (RON)'
        }
      }
    }
  };

  const handleMonthChange = (value) => {
    setSelectedMonths(value);
  };

  const differenceDisplay = (now, past) => {
    return (
      <p>
        {calculateRaise(now, past) >= 0 ? (
          <span className="growth-upward">
            <FeatherIcon icon="arrow-up" />
            {calculateRaise(now, past)}
          </span>
        ) : (
          <span className="growth-downward">
            <FeatherIcon icon="arrow-down" />
            {calculateRaise(now, past)}
          </span>
        )}
        <span>Față de luna trecuta</span>
      </p>
    );
  };

  return (
    <>
      <Main theme={theme}>
      <Cards title="Cheltuieli">
          <Row gutter={25}>
            <Col xs={24}>
              <Cards
                headless
                bodyStyle={{
                  boxShadow: `0 0 8px ${theme["border-color-light"]}`,
                  padding: '20px'
                }}
              >
                <TableWrapper theme={theme}>
                  <Table
                    dataSource={Object.entries(expenses).map(([name, amount]) => ({
                      key: name,
                      name,
                      amount
                    }))}
                    columns={[
                      {
                        title: 'Nume Cheltuiala',
                        dataIndex: 'name',
                        key: 'name',
                      },
                      {
                        title: 'Suma (RON)',
                        dataIndex: 'amount',
                        key: 'amount',
                        render: (amount, record) => 
                          editingExpense === record.name ? (
                            <Input
                              type="number"
                              value={amount}
                              onChange={(e) => 
                                handleUpdateExpense(record.name, e.target.value)
                              }
                              onBlur={() => setEditingExpense(null)}
                              autoFocus
                            />
                          ) : (
                            <div onClick={() => setEditingExpense(record.name)}>
                              {numberWithCommas(amount.toFixed(2))}
                            </div>
                          )
                      },
                      {
                        title: 'Actiuni',
                        key: 'actions',
                        render: (_, record) => (
                          <Space>
                            <Button 
                              type="text" 
                              danger 
                              onClick={() => handleDeleteExpense(record.name)}
                              icon={<FeatherIcon icon="trash-2" size={14} />}
                            />
                          </Space>
                        )
                      }
                    ]}
                    pagination={false}
                    loading={loadingExpenses}
                  />
                </TableWrapper>

                <div style={{ marginTop: 20 }}>
                  <Form layout="inline">
                    <Form.Item>
                      <Input
                        placeholder="Nume cheltuiala"
                        value={newExpenseName}
                        onChange={(e) => setNewExpenseName(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Input
                        type="number"
                        placeholder="Suma"
                        value={newExpenseAmount}
                        onChange={(e) => setNewExpenseAmount(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button 
                        type="primary" 
                        onClick={handleAddExpense}
                      >
                        Adauga Cheltuiala
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </Cards>
            </Col>
          </Row>
        </Cards>
   
        <Cards title="Statistici generale">
          <Row gutter={25} style={{ placeItems: "end", placeContent: "end" }}>
          <Col sm={12} xs={24}>
              <Cards
                headless
                bodyStyle={{
                  boxShadow: `0 0 8px ${theme["border-color-light"]}`,
                }}
              >
                <EChartCard theme={theme}>
                  <div className="card-chunk">
                    <CardBarChart2 theme={theme}>
                      <Heading as="h2">{numberWithCommas(profitAfterExpenses.toFixed(2))} RON</Heading>
                      <span>Profit după cheltuieli</span>
                      <p>
                        <span>Total cheltuieli: {numberWithCommas(totalExpenses.toFixed(2))} RON</span>
                      </p>
                    </CardBarChart2>
                  </div>
                  <div className="card-chunk">
                    <ChartjsBarChartTransparent
                      labels={["Profit brut", "Cheltuieli", "Profit net"]}
                      datasets={[
                        {
                          data: [parseFloat(totalProfit), totalExpenses, profitAfterExpenses],
                          backgroundColor: [
                            "rgba(95, 99, 242, 0.7)",
                            "rgba(255, 105, 165, 0.7)",
                            "rgba(32, 201, 151, 0.7)"
                          ],
                          hoverBackgroundColor: [
                            "#5F63F2",
                            "#FF69A5",
                            "#20C997"
                          ],
                          label: "",
                          barPercentage: 1,
                        },
                      ]}
                      options={chartOptions}
                    />
                  </div>
                </EChartCard>
              </Cards>
            </Col>
            <Col sm={12} xs={24}>
              <Cards
                headless
                bodyStyle={{
                  boxShadow: `0 0 8px ${theme["border-color-light"]}`,
                }}
              >
                <EChartCard theme={theme}>
                  <div className="card-chunk">
                    <CardBarChart2 theme={theme}>
                      <Heading as="h2">{weekOrdersCount}</Heading>
                      <span>Comenzi Luna aceasta</span>
                      <p>
                        {calculateRaise(
                          weekOrdersCount,
                          weekOrdersCountTrecut
                        ) >= 0 ? (
                          <span className="growth-upward">
                            <FeatherIcon icon="arrow-up" />
                            {calculateRaise(
                              weekOrdersCount,
                              weekOrdersCountTrecut
                            )}
                          </span>
                        ) : (
                          <span className="growth-downward">
                            <FeatherIcon icon="arrow-down" />
                            {calculateRaise(
                              weekOrdersCount,
                              weekOrdersCountTrecut
                            )}
                          </span>
                        )}

                        <span>Față de luna trecută</span>
                      </p>
                    </CardBarChart2>
                  </div>
                  <div className="card-chunk">
                    <ChartjsBarChartTransparent
                      labels={["Luna trecută", "Luna prezentă"]}
                      datasets={[
                        {
                          data: [weekOrdersCountTrecut, weekOrdersCount],
                          backgroundColor: "#EFEFFE",
                          hoverBackgroundColor: "#5F63F2",
                          label: "Nr. comenzi",
                          barPercentage: 1,
                        },
                      ]}
                      options={chartOptions}
                    />
                  </div>
                </EChartCard>
              </Cards>
            </Col>
            <Col sm={12} xs={24}>
              <Cards
                headless
                bodyStyle={{
                  boxShadow: `0 0 8px ${theme["border-color-light"]}`,
                }}
              >
                <EChartCard theme={theme}>
                  <div className="card-chunk">
                    <CardBarChart2 theme={theme}>
                      <Heading as="h2">{venit} RON</Heading>
                      <span>Venit</span>
                      <p>
                        {calculateRaise(venit, venitTrecut) >= 0 ? (
                          <span className="growth-upward">
                            <FeatherIcon icon="arrow-up" />
                            {calculateRaise(venit, venitTrecut)}
                          </span>
                        ) : (
                          <span className="growth-downward">
                            <FeatherIcon icon="arrow-down" />
                            {calculateRaise(venit, venitTrecut)}
                          </span>
                        )}

                        <span>Față de luna trecută</span>
                      </p>
                    </CardBarChart2>
                  </div>
                  <div className="card-chunk">
                    <ChartjsBarChartTransparent
                      labels={["Luna trecută", "Luna prezentă"]}
                      datasets={[
                        {
                          data: [venitTrecut, venit],
                          backgroundColor: "#FFF0F6",
                          hoverBackgroundColor: "#FF69A5",
                          label: "Venit",
                          barPercentage: 1,
                        },
                      ]}
                      options={chartOptions}
                    />
                  </div>
                </EChartCard>
              </Cards>
            </Col>
            <Col sm={12} xs={24}>
              <Cards
                headless
                bodyStyle={{
                  boxShadow: `0 0 8px ${theme["border-color-light"]}`,
                }}
              >
                <EChartCard theme={theme}>
                  <div className="card-chunk">
                    <CardBarChart2 theme={theme}>
                      <Heading as="h2">{totalProfit} RON</Heading>
                      <span>Profit</span>
                      <p>
                        {calculateRaise(totalProfit, totalProfitTrecut) >= 0 ? (
                          <span className="growth-upward">
                            <FeatherIcon icon="arrow-up" />
                            {calculateRaise(totalProfit, totalProfitTrecut)}
                          </span>
                        ) : (
                          <span className="growth-downward">
                            <FeatherIcon icon="arrow-down" />
                            {calculateRaise(totalProfit, totalProfitTrecut)}
                          </span>
                        )}

                        <span>Față de luna trecută</span>
                      </p>
                    </CardBarChart2>
                  </div>
                  <div className="card-chunk">
                    <ChartjsBarChartTransparent
                      labels={["Luna trecută", "Luna prezentă"]}
                      datasets={[
                        {
                          data: [totalProfitTrecut, totalProfit],
                          backgroundColor: "#FFF0F6",
                          hoverBackgroundColor: "#FF69A5",
                          label: "Profit",
                          barPercentage: 1,
                        },
                      ]}
                      options={chartOptions}
                    />
                  </div>
                </EChartCard>
              </Cards>
            </Col>

            <Col sm={12} xs={24}>
              <Cards
                headless
                bodyStyle={{
                  boxShadow: `0 0 8px ${theme["border-color-light"]}`,
                }}
              >
                <EChartCard theme={theme}>
                  <div className="card-chunk">
                    <CardBarChart2 theme={theme}>
                      <Heading as="h2">{avg} RON</Heading>
                      <span>Media de pret a unei comenzi</span>
                      <p>
                        {calculateRaise(avg, avgTrecut) >= 0 ? (
                          <span className="growth-upward">
                            <FeatherIcon icon="arrow-up" />
                            {calculateRaise(avg, avgTrecut)}
                          </span>
                        ) : (
                          <span className="growth-downward">
                            <FeatherIcon icon="arrow-down" />
                            {calculateRaise(avg, avgTrecut)}
                          </span>
                        )}
                        <span>De luna trecuta</span>
                      </p>
                    </CardBarChart2>
                  </div>
                  <div className="card-chunk">
                    <ChartjsBarChartTransparent
                      labels={["Luna trecută", "Luna prezentă"]}
                      datasets={[
                        {
                          data: [avgTrecut, avg],
                          backgroundColor: "#E8FAF4",
                          hoverBackgroundColor: "#20C997",
                          label: "Avg Comenzi",
                          barPercentage: 1,
                        },
                      ]}
                      options={chartOptions}
                    />
                  </div>
                </EChartCard>
              </Cards>
            </Col>
            <Col sm={12} xs={24}>
              <Cards
                headless
                bodyStyle={{
                  boxShadow: `0 0 8px ${theme["border-color-light"]}`,
                }}
              >
                <EChartCard theme={theme}>
                  <div className="card-chunk">
                    <CardBarChart2 theme={theme}>
                      <Heading as="h2">{useri}</Heading>
                      <span>Utilizatori noi</span>
                      <p>
                        {calculateRaise(useri, useriTrecut) >= 0 ? (
                          <span className="growth-upward">
                            <FeatherIcon icon="arrow-up" />
                            {calculateRaise(useri, useriTrecut)}
                          </span>
                        ) : (
                          <span className="growth-downward">
                            <FeatherIcon icon="arrow-down" />
                            {calculateRaise(useri, useriTrecut)}
                          </span>
                        )}
                        <span>De luna trecuta</span>
                      </p>
                    </CardBarChart2>
                  </div>
                  <div className="card-chunk">
                    <ChartjsBarChartTransparent
                      labels={["Luna trecută", "Luna prezentă"]}
                      datasets={[
                        {
                          data: [useriTrecut, useri],
                          backgroundColor: "#E9F5FF",
                          hoverBackgroundColor: "#2C99FF",
                          label: "Nr. vizitatori",
                          barPercentage: 1,
                        },
                      ]}
                      options={chartOptions}
                    />
                  </div>
                </EChartCard>
              </Cards>
            </Col>

            <Col sm={12} xs={24}>
              <Cards
                headless
                bodyStyle={{
                  boxShadow: `0 0 8px ${theme["border-color-light"]}`,
                }}
              >
                <EChartCard theme={theme}>
                  <div className="card-chunk">
                    <CardBarChart2 theme={theme}>
                      <Heading as="h2">{conversionRate}%</Heading>
                      <span>Rata de conversie in prezent</span>
                      {differenceDisplay(conversionRate, conversionRatePast)}
                    </CardBarChart2>
                  </div>
                  <div className="card-chunk">
                    <ChartjsBarChartTransparent
                      labels={["In prezent"]}
                      datasets={[
                        {
                          data: [conversionRate],
                          backgroundColor: "#E8FAF4",
                          hoverBackgroundColor: "#20C997",
                          label: "Rate de conversie",
                          barPercentage: 1,
                        },
                      ]}
                      options={chartOptions}
                    />
                  </div>
                </EChartCard>
              </Cards>
            </Col>

            <Col sm={12} xs={24}>
              <Cards
                headless
                bodyStyle={{
                  boxShadow: `0 0 8px ${theme["border-color-light"]}`,
                }}
              >
                <EChartCard theme={theme}>
                  <div className="card-chunk">
                    <CardBarChart2 theme={theme}>
                      <Heading as="h2">
                        {sources.facebook?.sessions} sesiuni
                      </Heading>
                      <span>Trafic Facebook</span>
                      {differenceDisplay(
                        sources.facebook?.sessions,
                        sourcesPast.facebookPast?.sessions
                      )}
                    </CardBarChart2>
                  </div>
                  <div className="card-chunk">
                    <ChartjsBarChartTransparent
                      labels={["nr. utilizatori", "nr. sesiuni"]}
                      datasets={[
                        {
                          data: [
                            sources.facebook?.users,
                            sources.facebook?.sessions,
                          ],
                          backgroundColor: "#E8FAF4",
                          hoverBackgroundColor: "#20C997",
                          label: "",
                          barPercentage: 1,
                        },
                      ]}
                      options={chartOptions}
                    />
                  </div>
                </EChartCard>
              </Cards>
            </Col>
            <Col sm={12} xs={24}>
              <Cards
                headless
                bodyStyle={{
                  boxShadow: `0 0 8px ${theme["border-color-light"]}`,
                }}
              >
                <EChartCard theme={theme}>
                  <div className="card-chunk">
                    <CardBarChart2 theme={theme}>
                      <Heading as="h2">
                        {sources.google?.sessions} sesiuni
                      </Heading>
                      <span>Trafic Google</span>
                      {differenceDisplay(
                        sources.google?.sessions,
                        sourcesPast.googlePast?.sessions
                      )}
                    </CardBarChart2>
                  </div>
                  <div className="card-chunk">
                    <ChartjsBarChartTransparent
                      labels={["nr. utilizatori", "nr. sesiuni"]}
                      datasets={[
                        {
                          data: [
                            sources.google?.users,
                            sources.google?.sessions,
                          ],
                          backgroundColor: "#E8FAF4",
                          hoverBackgroundColor: "#20C997",
                          label: "",
                          barPercentage: 1,
                        },
                      ]}
                      options={chartOptions}
                    />
                  </div>
                </EChartCard>
              </Cards>
            </Col>

            <Col sm={12} xs={24}>
              <Cards
                headless
                bodyStyle={{
                  boxShadow: `0 0 8px ${theme["border-color-light"]}`,
                }}
              >
                <EChartCard theme={theme}>
                  <div className="card-chunk">
                    <CardBarChart2 theme={theme}>
                      <Heading as="h2">
                        {sources.youtube?.sessions} sesiuni
                      </Heading>
                      <span>Trafic Youtube</span>
                      {differenceDisplay(
                        sources.youtube?.sessions,
                        sourcesPast.youtubePast?.sessions
                      )}
                    </CardBarChart2>
                  </div>
                  <div className="card-chunk">
                    <ChartjsBarChartTransparent
                      labels={["nr. utilizatori", "nr. sesiuni"]}
                      datasets={[
                        {
                          data: [
                            sources.youtube?.users,
                            sources.youtube?.sessions,
                          ],
                          backgroundColor: "#E8FAF4",
                          hoverBackgroundColor: "#20C997",
                          label: "",
                          barPercentage: 1,
                        },
                      ]}
                      options={chartOptions}
                    />
                  </div>
                </EChartCard>
              </Cards>
            </Col>

            <Col sm={12} xs={24}>
              <Cards
                headless
                bodyStyle={{
                  boxShadow: `0 0 8px ${theme["border-color-light"]}`,
                }}
              >
                <EChartCard theme={theme}>
                  <div className="card-chunk">
                    <CardBarChart2 theme={theme}>
                      <Heading as="h2">
                        {sources.direct_url?.sessions} sesiuni
                      </Heading>
                      <span>Trafic Direct</span>
                      {differenceDisplay(
                        sources.direct_url?.sessions,
                        sourcesPast.direct_urlPast?.sessions
                      )}
                    </CardBarChart2>
                  </div>
                  <div className="card-chunk">
                    <ChartjsBarChartTransparent
                      labels={["nr. utilizatori", "nr. sesiuni"]}
                      datasets={[
                        {
                          data: [
                            sources.direct_url?.users,
                            sources.direct_url?.sessions,
                          ],
                          backgroundColor: "#E8FAF4",
                          hoverBackgroundColor: "#20C997",
                          label: "",
                          barPercentage: 1,
                        },
                      ]}
                      options={chartOptions}
                    />
                  </div>
                </EChartCard>
              </Cards>
            </Col>
            <Col sm={12} xs={24}>
              <Cards
                headless
                bodyStyle={{
                  boxShadow: `0 0 8px ${theme["border-color-light"]}`,
                }}
              >
                <EChartCard theme={theme}>
                  <div className="card-chunk">
                    <CardBarChart2 theme={theme}>
                      <Heading as="h2">
                        {sources.necunoscut?.sessions} sesiuni
                      </Heading>
                      <span>Trafic Necunoscut</span>
                      {differenceDisplay(
                        sources.necunoscut?.sessions,
                        sourcesPast.necunoscutPast?.sessions
                      )}
                    </CardBarChart2>
                  </div>
                  <div className="card-chunk">
                    <ChartjsBarChartTransparent
                      labels={["nr. utilizatori", "nr. sesiuni"]}
                      datasets={[
                        {
                          data: [
                            sources.necunoscut?.users,
                            sources.necunoscut?.sessions,
                          ],
                          backgroundColor: "#E8FAF4",
                          hoverBackgroundColor: "#20C997",
                          label: "",
                          barPercentage: 1,
                        },
                      ]}
                      options={chartOptions}
                    />
                  </div>
                </EChartCard>
              </Cards>
            </Col>
          </Row>
        </Cards>
        <Row>
          <Col xs={24}>
            <Cards title="Cele mai populare produse">
              <TableWrapper
                theme={theme}
                className="table-order table-responsive"
              >
                <Table
                  dataSource={mostPopularProducts}
                  columns={mostPopularProductsColumns}
                />
              </TableWrapper>
            </Cards>
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default AdminDashboard;
