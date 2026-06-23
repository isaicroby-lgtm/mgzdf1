import React, { useState, useEffect } from "react";
import { Row, Col, Radio, Table, Input, DatePicker, Card, Statistic, Progress, Tag, Divider, Dropdown } from "antd";
import FeatherIcon from "feather-icons-react";
import dynamic from "next/dynamic";
import dayjs from "dayjs";

import { getAllOrders, updateStatuses } from "@/api/comenzi";
import renderBadge, { BadgeStyle, badgeKeys } from "@/utility/renderBadge";
import theme from "@/components/atoms/theme";
import PageHeader from "@/components/atoms/PageHeader";
import { Main, TableWrapper } from "@/components/style";
import Cards from "@/components/atoms/Cards";
import { TopToolBox } from "@/components/organisms/style";
import Button from "@/components/atoms/Button";
import { fetchAllProductsForList } from "@/api/products";
import { useSelector } from "react-redux";

const ModalIndOrderAdmin = dynamic(
  () => import("../modals/modal-ind-order-admin"),
  { ssr: false }
);

const { RangePicker } = DatePicker;

// Lista completă de statusuri
const ALL_STATUSES = [
  "plasata",
  "trimisa",
  "plata online efectuata",
  "asteptare plata online",
  "plata online esuata",
  "livrata",
  "respinsa",
  "in lucru",
  "returnata",
  "livrare respinsa",
  "anulata de client",
  "anulata de doifrati",
];

const Orders = ({ sentFromAnother, filterEmail }) => {
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(false);
  const [changedStatus, setChangedStatus] = useState(false);

  const [orders, setOrders] = useState([]);
  const [rows, setRows] = useState([]);

  const [filterValue, setFilterValue] = useState();
  const [searchValue, setSearchValue] = useState();
  const [selectedMonth, setSelectedMonth] = useState('all');

  const [modalDetaliiComanda, setModalDetaliiComanda] = useState();
  const [allProducts, setAllProducts] = useState([]);

  const [monthlyStats, setMonthlyStats] = useState({});
  const [currentMonthDetails, setCurrentMonthDetails] = useState({});
  const [statusBreakdown, setStatusBreakdown] = useState({});
  const [allTimeStats, setAllTimeStats] = useState({});

  const filterKey = [...badgeKeys];

  const { products } = useSelector((state) => {
    return {
      products: state.products.productsAll,
    };
  });

  useEffect(() => {
    setAllProducts(products);
  }, [products]);

  useEffect(() => {
    setStatus(modalDetaliiComanda?.status);
  }, [modalDetaliiComanda]);

  // Calculează statisticile lunare și all-time
  const calculateStats = (orders) => {
    const stats = {};
    const statusCounts = {};
    const allTime = {
      total: 0,
      completed: 0,
      cancelled: 0,
      pending: 0,
      card: 0,
      ramburs: 0,
      totalAmount: 0,
      completedAmount: 0,
      statusCounts: {}
    };
    
    ALL_STATUSES.forEach(status => {
      statusCounts[status] = 0;
      allTime.statusCounts[status] = 0;
    });
    
    orders.forEach(order => {
      const month = dayjs(order.timestamp?.toDate()).format('YYYY-MM');
      if (!stats[month]) {
        stats[month] = {
          total: 0,
          completed: 0,
          cancelled: 0,
          pending: 0,
          card: 0,
          ramburs: 0,
          totalAmount: 0,
          completedAmount: 0,
          statusCounts: { ...statusCounts }
        };
      }
      
      stats[month].total++;
      stats[month].totalAmount += order.price || 0;
      
      allTime.total++;
      allTime.totalAmount += order.price || 0;
      
      if (order.status && stats[month].statusCounts[order.status] !== undefined) {
        stats[month].statusCounts[order.status]++;
      }
      
      if (order.status && allTime.statusCounts[order.status] !== undefined) {
        allTime.statusCounts[order.status]++;
      }
      
      if (['livrata', 'plata online efectuata'].includes(order.status)) {
        stats[month].completed++;
        stats[month].completedAmount += order.price || 0;
        allTime.completed++;
        allTime.completedAmount += order.price || 0;
      } else if (['anulata de client', 'anulata de doifrati', 'respinsa', 'plata online esuata'].includes(order.status)) {
        stats[month].cancelled++;
        allTime.cancelled++;
      } else {
        stats[month].pending++;
        allTime.pending++;
      }
      
      if (order.paymentType === 'card') {
        stats[month].card++;
        allTime.card++;
      } else if (order.paymentType === 'ramburs') {
        stats[month].ramburs++;
        allTime.ramburs++;
      }
    });
    
    setMonthlyStats(stats);
    setAllTimeStats(allTime);
  };

  const calculateCurrentDetails = (orders, month) => {
    let filteredOrders = orders;
    
    if (month !== 'all') {
      filteredOrders = orders.filter(order => 
        dayjs(order.timestamp?.toDate()).format('YYYY-MM') === month
      );
    }
    
    const statusDetails = {};
    ALL_STATUSES.forEach(status => {
      statusDetails[status] = filteredOrders.filter(order => order.status === status).length;
    });
    
    const isAllTime = month === 'all';
    const sourceStats = isAllTime ? allTimeStats : monthlyStats[month];
    
    const details = {
      totalOrders: filteredOrders.length,
      totalAmount: filteredOrders.reduce((sum, order) => sum + (order.price || 0), 0),
      completedOrders: filteredOrders.filter(order => 
        ['livrata', 'plata online efectuata'].includes(order.status)
      ).length,
      cancelledOrders: filteredOrders.filter(order => 
        ['anulata de client', 'anulata de doifrati', 'respinsa', 'plata online esuata'].includes(order.status)
      ).length,
      pendingOrders: filteredOrders.filter(order => 
        !['livrata', 'plata online efectuata', 'anulata de client', 'anulata de doifrati', 'respinsa', 'plata online esuata'].includes(order.status)
      ).length,
      cardPayments: filteredOrders.filter(order => order.paymentType === 'card').length,
      rambursPayments: filteredOrders.filter(order => order.paymentType === 'ramburs').length,
      averageOrderValue: filteredOrders.length > 0 ? 
        filteredOrders.reduce((sum, order) => sum + (order.price || 0), 0) / filteredOrders.length : 0,
      statusBreakdown: statusDetails,
      isAllTime: isAllTime
    };
    
    setCurrentMonthDetails(details);
    setStatusBreakdown(statusDetails);
  };

  const postNewStatuses = async () => {
    await updateStatuses(orders);
    setChangedStatus(false);
  };

  // Coloanele originale ale tabelului - EXACT CA ÎNAINTE
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Id comandă",
      dataIndex: "docId",
      key: "docId",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => {
        return b.email?.localeCompare(a.email);
      },
    },
    {
      title: "Data crearii",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => {
        return b.timestamp - a.timestamp;
      },
    },
    {
      title: "Durata pregatirii",
      dataIndex: "datePregatirii",
      key: "datePregatirii",
      sorter: (a, b) => {
        const dayjsDate1a = dayjs(a.timestamp?.toDate());
        const dayjsDate2a = dayjs(a.finishDate?.toDate() || Date.now());

        const differenceInDaysa = dayjsDate2a.diff(dayjsDate1a, "day");

        const dayjsDate1b = dayjs(b.timestamp?.toDate());
        const dayjsDate2b = dayjs(b.finishDate?.toDate() || Date.now());

        const differenceInDaysb = dayjsDate2b.diff(dayjsDate1b, "day");

        return differenceInDaysb - differenceInDaysa;
      },
    },
    {
      title: "Status",
      dataIndex: "statusDiv",
      key: "statusDiv",
      sorter: (a, b) => {
        return b.status?.localeCompare(a.status);
      },
    },
    {
      title: "Pret de baza",
      dataIndex: "baseAmount",
      key: "baseAmount",
      sorter: (a, b) => {
        return b.baseAmount - a.baseAmount;
      },
    },
    {
      title: "Pret de vanzare",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      sorter: (a, b) => {
        return b.amount - a.amount;
      },
    },
  ];

  const filterOrders = (orders) => {
    return orders?.filter((or) => {
      let v1 = false;
      let v2 = false;
      let v3 = false;
      let v4 = false;

      if (!filterValue) v1 = true;
      else if (or.status === filterValue) v1 = true;

      if (!searchValue) v2 = true;
      else if (or.phone?.includes(searchValue)) v2 = true;
      else if (or.docId?.includes(searchValue)) v2 = true;
      else if (or.awb?.includes(searchValue)) v2 = true;
      else if (or.numarComanda?.includes(searchValue)) v2 = true;
      else if (or.firstName?.includes(searchValue)) v2 = true;
      else if (or.lastName?.includes(searchValue)) v2 = true;
      else if (or.email?.includes(searchValue)) v2 = true;

      if (!filterEmail) v3 = true;
      else if (or.email === filterEmail) v3 = true;

      if (selectedMonth === 'all') v4 = true;
      else if (dayjs(or.timestamp.toDate()).format('YYYY-MM') === selectedMonth) v4 = true;

      return v1 && v2 && v3 && v4;
    });
  };

  const formatOrdersToTable = (orders) => {
    const dataSource = [];

    filterOrders(orders)?.forEach((value, key) => {
      const {
        status,
        docId,
        firstName,
        lastName,
        price,
        timestamp,
        email,
        finishDate,
        discounts = [],
        ...rest
      } = value;

      const dayjsDate1 = dayjs(timestamp.toDate());
      const dayjsDate2 = dayjs(finishDate?.toDate() || Date.now());

      const differenceInDays = dayjsDate2.diff(dayjsDate1, "day");

      dataSource.push({
        ...rest, // Păstrează toate celelalte câmpuri
        key: key + 1, // ID auto-incrementat
        id: key + 1, // ID auto-incrementat
        docId: docId, // Asigură-te că docId este inclus
        customer: `${firstName} ${lastName}`,
        email: email,
        statusDiv: <div style={{ minWidth: 124 }}>{renderBadge(status)}</div>,
        amount: price,
        baseAmount: (price + discounts?.reduce((a, b) => a + b.value, 0) || 0).toFixed(2),
        date: dayjs(timestamp.toDate()).format("DD.MM.YYYY, HH:mm").toString(),
        datePregatirii: (
          <div>
            {differenceInDays <= 1 ? (
              <BadgeStyle color={theme["nav-green"]}>
                mai putin de o zi
              </BadgeStyle>
            ) : differenceInDays <= 3 ? (
              <BadgeStyle color={theme["rate-star-color"]}>
                {differenceInDays} zile
              </BadgeStyle>
            ) : differenceInDays <= 5 ? (
              <BadgeStyle color={theme["secondary-color"]}>
                {differenceInDays} zile
              </BadgeStyle>
            ) : (
              <BadgeStyle color={theme["secondary-color"]}>
                {differenceInDays} zile
              </BadgeStyle>
            )}
          </div>
        ),
      });
    });

    setRows(dataSource);
  };

  const handleChangeForFilter = (e) => {
    const { value } = e.target;
    setFilterValue(value);
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date ? date.format('YYYY-MM') : dayjs().format('YYYY-MM'));
  };

  // Generează opțiunile pentru lunile disponibile + "Toate comenzile"
  const getMonthOptions = () => {
    const months = Object.keys(monthlyStats).sort((a, b) => {
      return dayjs(b).valueOf() - dayjs(a).valueOf();
    });
    
    return [
      <Radio.Button key="all" value="all" style={{ fontWeight: 'bold' }}>
        Toate comenzile ({allTimeStats.total || 0})
      </Radio.Button>,
      ...months.map(month => (
        <Radio.Button key={month} value={month}>
          {dayjs(month).format('MMMM YYYY')} ({monthlyStats[month]?.total || 0})
        </Radio.Button>
      ))
    ];
  };

  // Funcție pentru a obține culoarea în funcție de status
  const getStatusColor = (status) => {
    const colors = {
      'plasata': 'blue',
      'trimisa': 'orange',
      'plata online efectuata': 'green',
      'asteptare plata online': 'gold',
      'plata online esuata': 'red',
      'livrata': 'green',
      'respinsa': 'red',
      'in lucru': 'purple',
      'returnata': 'volcano',
      'livrare respinsa': 'red',
      'anulata de client': 'magenta',
      'anulata de doifrati': 'magenta'
    };
    return colors[status] || 'default';
  };

  useEffect(() => {
    formatOrdersToTable(orders);
    calculateStats(orders);
    calculateCurrentDetails(orders, selectedMonth);
  }, [orders, filterValue, searchValue, selectedMonth]);

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getAllOrders();
      setOrders(orders);
    };

    fetchOrders();
  }, []);

  return (
    <>
      {!sentFromAnother ? <PageHeader title="Comenzi" /> : null}
      <ModalIndOrderAdmin
        modalDetaliiComanda={modalDetaliiComanda}
        setModalDetaliiComanda={setModalDetaliiComanda}
        allProducts={allProducts}
      />
      <Main theme={theme}>
        <Cards headless>
          {!sentFromAnother ? (
            <Row gutter={15}>
              <Col xs={24}>
                <TopToolBox theme={theme}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    <Input
                      size="large"
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                      }}
                      style={{ width: "50%", minWidth: 300 }}
                      suffix={<FeatherIcon icon="search" size={18} />}
                    />

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "50%",
                        justifyContent: "flex-end",
                        minWidth: "fit-content",
                      }}
                    >
                      <span style={{ marginRight: 8 }}> Status comanda:</span>
                      <Radio.Group
                        onChange={handleChangeForFilter}
                        defaultValue=""
                      >
                        <Radio.Button value="">toate</Radio.Button>
                        {ALL_STATUSES.map((value) => {
                          return (
                            <Radio.Button
                              key={value.toLowerCase()}
                              value={value.toLowerCase()}
                            >
                              {value}
                            </Radio.Button>
                          );
                        })}
                      </Radio.Group>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: 12 }}>
                    <span style={{ marginRight: 8, fontWeight: 500 }}>Perioada:</span>
                    <Radio.Group 
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      value={selectedMonth}
                      style={{ marginBottom: 16 }}
                    >
                      {getMonthOptions()}
                    </Radio.Group>
                  </div>
                </TopToolBox>
              </Col>
            </Row>
          ) : null}

          {/* Statistici pentru perioada selectată */}
          {!sentFromAnother && currentMonthDetails.totalOrders > 0 && (
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col xs={24}>
                <Cards title={`Statistici pentru ${dayjs(selectedMonth).format('MMMM YYYY')}`}>
                  <Row gutter={16}>
                    <Col xs={6}>
                      <Statistic
                        title="Total Comenzi"
                        value={currentMonthDetails.totalOrders}
                        valueStyle={{ color: '#1890ff' }}
                        prefix={<FeatherIcon icon="shopping-cart" size={16} />}
                      />
                    </Col>
                    <Col xs={6}>
                      <Statistic
                        title="Valoare Totală"
                        value={currentMonthDetails.totalAmount.toFixed(2)}
                        valueStyle={{ color: '#3f8600' }}
                        prefix="RON"
                        suffix={<FeatherIcon icon="dollar-sign" size={16} />}
                      />
                    </Col>
                    <Col xs={6}>
                      <Statistic
                        title="Valoare Medie/Comandă"
                        value={currentMonthDetails.averageOrderValue.toFixed(2)}
                        valueStyle={{ color: '#722ed1' }}
                        prefix="RON"
                      />
                    </Col>
                    <Col xs={6}>
                      <Statistic
                        title="Comenzi Finalizate"
                        value={currentMonthDetails.completedOrders}
                        valueStyle={{ color: '#52c41a' }}
                        suffix={`/ ${currentMonthDetails.totalOrders}`}
                      />
                    </Col>
                  </Row>
                  
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col xs={8}>
                      <Card size="small" title="Metode de Plată">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span>Card</span>
                          <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                            {currentMonthDetails.cardPayments}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Ramburs</span>
                          <span style={{ fontWeight: 'bold', color: '#fa8c16' }}>
                            {currentMonthDetails.rambursPayments}
                          </span>
                        </div>
                      </Card>
                    </Col>
                    
                    <Col xs={8}>
                      <Card size="small" title="Status Comenzi">
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span>Finalizate</span>
                            <span>{currentMonthDetails.completedOrders}</span>
                          </div>
                          <Progress 
                            percent={Math.round((currentMonthDetails.completedOrders / currentMonthDetails.totalOrders) * 100)} 
                            size="small" 
                            strokeColor="#52c41a"
                          />
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span>Anulate</span>
                            <span>{currentMonthDetails.cancelledOrders}</span>
                          </div>
                          <Progress 
                            percent={Math.round((currentMonthDetails.cancelledOrders / currentMonthDetails.totalOrders) * 100)} 
                            size="small" 
                            strokeColor="#ff4d4f"
                          />
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span>În așteptare</span>
                            <span>{currentMonthDetails.pendingOrders}</span>
                          </div>
                          <Progress 
                            percent={Math.round((currentMonthDetails.pendingOrders / currentMonthDetails.totalOrders) * 100)} 
                            size="small" 
                            strokeColor="#faad14"
                          />
                        </div>
                      </Card>
                    </Col>
                    
                    <Col xs={8}>
                      <Card size="small" title="Rata de Success">
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                          <Progress
                            type="circle"
                            percent={Math.round((currentMonthDetails.completedOrders / currentMonthDetails.totalOrders) * 100)}
                            strokeColor={{
                              '0%': '#108ee9',
                              '100%': '#87d068',
                            }}
                          />
                          <div style={{ marginTop: 12, fontWeight: 'bold' }}>
                            {Math.round((currentMonthDetails.completedOrders / currentMonthDetails.totalOrders) * 100)}% Success
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  {/* Breakdown detaliat pe statusuri */}
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col xs={24}>
                      <Card size="small" title="Detalii Statusuri Comenzi">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {ALL_STATUSES.map(status => (
                            currentMonthDetails.statusBreakdown?.[status] > 0 && (
                              <Tag 
                                key={status} 
                                color={getStatusColor(status)}
                                style={{ padding: '4px 8px', margin: '4px' }}
                              >
                                {status}: {currentMonthDetails.statusBreakdown[status]}
                              </Tag>
                            )
                          ))}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </Cards>
              </Col>
            </Row>
          )}

          {changedStatus && (
            <Button
              type="primary"
              isLoading={loading}
              style={{ padding: "7px 20px", marginBottom: "16px" }}
              onClick={postNewStatuses}
            >
              {loading ? "Se trimite..." : "Salvează modificările"}
            </Button>
          )}

          <Row gutter={15}>
            <Col xs={24}>
              {rows?.length ? (
                <TableWrapper
                  theme={theme}
                  className="table-order table-responsive"
                >
                  {/* Tabelul original - EXACT CA ÎNAINTE */}
                  <Table
                    dataSource={rows}
                    columns={columns}
                    onRow={(record) => {
                      return {
                        onClick: () => {
                          // Folosește docId pentru a găsi comanda corectă în array-ul orders
                          const current = orders.find(
                            (order) => order.docId === record.docId
                          );
                          if (current) {
                            setModalDetaliiComanda({
                              ...current,
                              cash_on_delivery:
                                current?.paymentType === "ramburs"
                                  ? current?.price
                                  : 0,
                            });
                          }
                        },
                      };
                    }}
                  />
                </TableWrapper>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  <FeatherIcon icon="inbox" size={48} />
                  <div style={{ marginTop: 16 }}>
                    {selectedMonth === 'all' 
                      ? "Nu există comenzi în baza de date" 
                      : "Nu există comenzi pentru perioada selectată"
                    }
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Cards>

        {/* CSS pentru a asigura că meniurile sunt vizibile */}
        <style jsx global>{`
          /* Asigură-te că textul din Radio.Button este vizibil */
          .ant-radio-button-wrapper {
            color: #000 !important;
          }
          
          .ant-radio-button-wrapper-checked {
            color: #fff !important;
            background: #1890ff !important;
            border-color: #1890ff !important;
          }
          
          .ant-radio-button-wrapper:hover {
            color: #1890ff !important;
          }
          
          .ant-radio-button-wrapper-checked:hover {
            color: #fff !important;
          }
          
          /* Asigură-te că tabelul este responsive fără să schimbi layout-ul */
          @media (max-width: 768px) {
            .table-order .ant-table {
              font-size: 12px;
            }
            
            .table-order .ant-table-thead > tr > th,
            .table-order .ant-table-tbody > tr > td {
              padding: 8px 4px;
            }
          }
        `}</style>
      </Main>
    </>
  );
};

export default Orders;