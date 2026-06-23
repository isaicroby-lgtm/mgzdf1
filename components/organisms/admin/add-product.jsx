"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  Row,
  Col,
  Form,
  Input,
  Select,
  InputNumber,
  Radio,
  Upload,
  message,
  Switch,
  Tooltip,
  Card,
  Statistic,
} from "antd";
import { getDownloadURL, ref } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import FeatherIcon from "feather-icons-react";
import update from "immutability-helper";

import Editor from "ckeditor5-cb/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import { encodeURL } from "@/utility/urlFormatting";
import { storage } from "@/public/firebase";
import productActions from "@/redux/product/actions";
import {
  createProductFirestore,
  fetchProductDescription,
  updateProductFirestore,
} from "@/api/products";

import PageHeader from "@/components/atoms/PageHeader";
import { AddProductForm } from "@/components/organisms/style";
import { BasicFormWrapper, Main } from "@/components/style";
import Cards from "@/components/atoms/Cards";
import Modal from "@/components/atoms/Modal";
import Heading from "@/components/atoms/Heading";
import Button from "@/components/atoms/Button";
import theme from "@/components/atoms/theme";

const { Option } = Select;
const { Dragger } = Upload;

const _ = require("lodash");

const updateWithThese = {};

const findDiffFunction = (oldProduct, newProduct) => {
  const differences = _.reduce(
    oldProduct,
    function (result, value, key) {
      return _.isEqual(value, newProduct[key]) ? result : result.concat(key);
    },
    []
  );

  const differences2 = _.reduce(
    newProduct,
    function (result, value, key) {
      return _.isEqual(value, oldProduct[key]) ? result : result.concat(key);
    },
    []
  );

  for (const diff of differences) {
    if (newProduct[diff] !== undefined) {
      updateWithThese[diff] = newProduct[diff];
    }
  }

  for (const diff of differences2) {
    if (newProduct[diff] !== undefined && diff !== "file") {
      updateWithThese[diff] = newProduct[diff];
    }
  }
};

// Funcție pentru calculul profitabilității
const calculateProfitability = (pretVanzare, pretAchizitie) => {
  if (!pretVanzare || !pretAchizitie) return { profitBrut: 0, profitNet: 0, tva: 0 };
  
  const profitBrut = pretVanzare - pretAchizitie;
  const tva = profitBrut * 0.21; // 21% TVA
  const profitNet = profitBrut - tva;
  
  return {
    profitBrut: Number(profitBrut.toFixed(2)),
    profitNet: Number(profitNet.toFixed(2)),
    tva: Number(tva.toFixed(2))
  };
};

const DragableUploadListItem = ({ originNode, moveRow, file, fileList }) => {
  const ref = useRef(null);
  const index = fileList.indexOf(file);
  const errorNode = (
    <Tooltip title="Upload Error">{originNode.props.children}</Tooltip>
  );
  const isOver = false;
  const dropClassName = "";

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const fromIndex = Number(e.dataTransfer.getData("text/plain"));
    const toIndex = index;

    moveRow(fromIndex, toIndex);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      ref={ref}
      className={`ant-upload-draggable-list-item ${
        isOver ? dropClassName : ""
      }`}
      style={{
        WebkitUserDrag: "element",
        cursor: "move",
      }}
    >
      {file.status === "error" ? errorNode : originNode}
    </div>
  );
};

function AddProduct({ productId }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const { products, isLoading, isLoadingLow, categoryOptions, ageOptions } =
    useSelector((state) => {
      return {
        products: state.products.productsAll,
        isLoading: state.products.isLoading,
        isLoadingLow: state.products.isLoadingLow === true,
        categoryOptions: state.setariRules.category_options,
        ageOptions: state.setariRules.age_options,
      };
    });

  const [isLoadingFR, setIsLoadingFR] = useState(true);
  const [profitability, setProfitability] = useState({ profitBrut: 0, profitNet: 0, tva: 0 });

  const [modalOpen, setModalOpen] = useState();
  const [product, setProduct] = useState();
  const [files, setFiles] = useState([]);

  const [description, setDescription] = useState();

  // Funcție pentru actualizarea calculului profitabilității
  const updateProfitability = useCallback(() => {
    const pretVanzare = form.getFieldValue('price');
    const pretAchizitie = form.getFieldValue('pretAchizitie') || 0;
    
    const profitCalc = calculateProfitability(pretVanzare, pretAchizitie);
    setProfitability(profitCalc);
  }, [form]);

  // Handler pentru schimbarea prețului de vânzare
  const handlePriceChange = (value) => {
    // Așteaptă puțin pentru ca formularul să se actualizeze
    setTimeout(updateProfitability, 100);
  };

  // Handler pentru schimbarea prețului de achiziție
  const handlePurchasePriceChange = (value) => {
    // Așteaptă puțin pentru ca formularul să se actualizeze
    setTimeout(updateProfitability, 100);
  };

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = files[dragIndex];
      setFiles(
        update(files, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        })
      );
    },
    [files]
  );

  const fileUploadProps = {
    name: "file",
    multiple: true,
    accept: ".jpg, .png, image/webp",
    customRequest: ({ onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    },
    onChange(info) {
      const { status } = info.file;

      if (status === "removed") {
        if (!files.length || files.length === 1) {
          form.setFieldValue("file", null);
          setFiles(info.fileList);
        } else {
          setFiles(info.fileList);
        }
      } else {
        form.setFieldValue("file", info.file);
        form.validateFields(["file"]);

        setFiles(info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} fisierul a fost uploadat cu succes`);
      } else if (status === "error") {
        message.error(
          `${info.file.name} fisierul nu a fost uploadat. A aparut o eroare`
        );
      }
    },
    listType: "picture",
    fileList: files?.map((file, i) => ({
      ...file,
      url: file.fileDownloadURL,
      thumbUrl: file.fileDownloadURL,
      status: "done",
      uid: file.fileDownloadURL,
    })),
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" onClick={(e) => {}} />,
    },
    itemRender: (originNode, file, currFileList) => (
      <DragableUploadListItem
        originNode={originNode}
        file={file}
        fileList={currFileList}
        moveRow={moveRow}
      />
    ),
  };

  const handleSubmit = async (values) => {
    setIsLoadingFR(true);

    dispatch(productActions.fetchProductsBegin());
    try {
      let productId;
      if (!product || !Object.keys(product)) {
        productId = (
          await createProductFirestore({ ...values, desc: description }, files)
        ).id;
      } else {
        findDiffFunction(product, { ...values, desc: description });
        productId = product.id;

        await updateProductFirestore({
          oldProduct: product,
          newProduct: { ...values, desc: description },
          fileList: files,
          updateWithThese2: updateWithThese,
        });
      }
    } catch (e) {
      alert(e);
      dispatch(productActions.fetchProductsErr(e));
    } finally {
      dispatch(productActions.fetchProductsEnd());

      setIsLoadingFR(false);
    }
    if (!product || !Object.keys(product)) router.push("/admin/produse");
    else {
      router.push(`/admin/produse/${encodeURL(product.name)}`);
    }
  };

  const onFinishFailed = async (errorInfo) => {
    alert("Hei! Ai uitat să completezi un câmp!");
  };

  const transferProduct = async (product) => {
    setFiles([]);

    setIsLoadingFR(false);

    if (product) {
      let i = 0;

      for (const f of product.fileRefs) {
        const fileDownloadURL = await getDownloadURL(ref(storage, f));

        const obj = {
          fileDownloadURL,
          fileRef: f,
        };

        setFiles((prev) => [...prev, obj]);

        if (i === 0) {
          form.setFieldValue("file", obj);
          form.validateFields(["file"]);
        }
        i++;
      }
    }
  };

  const id = productId;

  useEffect(() => {
    const fetchProduct = async () => {
      if (id && !product && products) {
        const _product = products?.find((pr) => pr.id === id);
        if (_product) {
          _product.reducere2 = _product?.discount2;
          _product.reducere3 = _product?.discount3;
          _product.profitul = _product?.price - _product?.pretAchizitie
          const desc = await fetchProductDescription(id);

          if (desc) _product.desc = desc;

          setDescription(desc);
          form.setFieldsValue(_product);

          setProduct({ ..._product });
          
          // Actualizează profitabilitatea pentru produsul existent
          updateProfitability();
        } else if (pathname.includes("admin")) router.push("/admin/produse");
        else router.push("/magazin");
      }
    };
    fetchProduct();
  }, [id, products, updateProfitability]);

  useEffect(() => {
    if (!isLoading && !files?.length) {
      transferProduct(product);
    }
  }, [product]);

  return (
    <>
      <Modal visible={modalOpen} onCancel={() => setModalOpen()}>
        <div
          style={{ display: "flex", width: "100%", flexWrap: "wrap", gap: 16 }}
        >
          {files?.map((file) => {
            let fileUrl;
            if (file.originFileObj)
              fileUrl = URL.createObjectURL(file.originFileObj);
            else fileUrl = file.fileDownloadURL;
            return (
              <img
                style={{
                  width: "15%",
                  height: "auto",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                src={fileUrl}
                alt=""
              />
            );
          })}
        </div>
      </Modal>
      <PageHeader ghost title="Adauga un produs" />
      <Main theme={theme}>
        <Row gutter={15}>
          <Col xs={24} span={24}>
            <Cards headless>
              <Row justify="center">
                <Col xxl={24} md={24} sm={24} xs={24}>
                  <AddProductForm theme={theme}>
                    {!isLoadingFR ? (
                      <Form
                        layout="vertical"
                        style={{ width: "100%" }}
                        form={form}
                        name="addProduct"
                        onFinish={handleSubmit}
                        onFinishFailed={onFinishFailed}
                        initialValues={{
                          status: "draft",
                          easyboxAvailability: true,
                          superPret: false,
                          ...product,
                        }}
                      >
                        <BasicFormWrapper theme={theme}>
                          <div className="add-product-block">
                            <Row gutter={15}>
                              <Col xs={24}>
                                <div className="add-product-content">
                                  <Cards title="Despre produs">
                                    <Form.Item
                                      rules={[{ required: true, message: "" }]}
                                      name="name"
                                      label="Numele produsului / Titlu"
                                    >
                                      <Input size="large" />
                                    </Form.Item>

                                    <Form.Item
                                      rules={[{ required: true, message: "" }]}
                                      name="code"
                                      label="Codul produsului"
                                    >
                                      <Input size="large" />
                                    </Form.Item>

                                    <Form.Item
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Ai uitat să selectezi o categorie",
                                        },
                                      ]}
                                      name="category"
                                      label="Categorie"
                                    >
                                      <Select
                                        showSearch
                                        style={{ width: "100%" }}
                                      >
                                        {categoryOptions?.map((cat) => (
                                          <Option
                                            key={cat}
                                            value={cat.toLowerCase()}
                                          >
                                            {cat}
                                          </Option>
                                        ))}
                                      </Select>
                                    </Form.Item>

                                    <Form.Item
                                      rules={[{ required: true, message: "" }]}
                                      name="price"
                                      label="Pretul actual"
                                    >
                                      <InputNumber
                                        addonBefore="RON"
                                        style={{ width: "100%" }}
                                        onChange={handlePriceChange}
                                      />
                                    </Form.Item>

                                    <Form.Item
                                      name="pretAchizitie"
                                      label="Pretul de achizitie"
                                    >
                                      <InputNumber
                                        addonBefore="RON"
                                        placeholder="(Opțional)"
                                        style={{ width: "100%" }}
                                        onChange={handlePurchasePriceChange}
                                      />
                                    </Form.Item>

                                    {/* Secțiunea nouă pentru Profitabilitate */}
                                    <Cards 
                                      title="Profitabilitate" 
                                      style={{ marginBottom: 24 }}
                                      bodyStyle={{ padding: '16px' }}
                                    >
                                      <Row gutter={16}>
                                        <Col xs={8}>
                                          <Statistic
                                            title="Profit Brut"
                                            value={profitability.profitBrut}
                                            precision={2}
                                            valueStyle={{
                                              color: profitability.profitBrut >= 0 ? '#3f8600' : '#cf1322'
                                            }}
                                            prefix="RON"
                                          />
                                        </Col>
                                        <Col xs={8}>
                                          <Statistic
                                            title="TVA (21%)"
                                            value={profitability.tva}
                                            precision={2}
                                            valueStyle={{ color: '#cf1322' }}
                                            prefix="RON"
                                          />
                                        </Col>
                                        <Col xs={8}>
                                          <Statistic
                                            title="Profit Net"
                                            value={profitability.profitNet}
                                            precision={2}
                                            valueStyle={{
                                              color: profitability.profitNet >= 0 ? '#3f8600' : '#cf1322'
                                            }}
                                            prefix="RON"
                                          />
                                        </Col>
                                      </Row>
                                      {profitability.profitNet < 0 && (
                                        <div style={{ marginTop: 16, color: '#cf1322', textAlign: 'center' }}>
                                          <FeatherIcon icon="alert-triangle" size={16} />
                                          <span style={{ marginLeft: 8 }}>
                                            Atenție: Produsul este neprofitabil!
                                          </span>
                                        </div>
                                      )}
                                    </Cards>
{/* --- Bloc GPSR: informații de siguranță (lipeste în interiorul Cards "Despre produs") --- */}
<Cards title="Informații de siguranță GPSR" style={{ marginTop: 24 }}>
  <Row gutter={16}>
    <Col xs={24} sm={24} md={12}>
      <Form.Item
        name="gpsrRepresentativeName"
        label="Numele reprezentantului GPSR UE"
        rules={[{ required: false, message: "Completează numele reprezentantului (opțional)" }]}
      >
        <Input size="large" />
      </Form.Item>
    </Col>

    <Col xs={24} sm={24} md={12}>
      <Form.Item
        name="gpsrRepresentativeEmail"
        label="Adresa de email al reprezentantului GPSR UE"
        rules={[
          { type: "email", message: "Adaugă un email valid" },
        ]}
      >
        <Input size="large" />
      </Form.Item>
    </Col>

    <Col xs={24}>
      <Form.Item
        name="gpsrRepresentativeAddress"
        label="Adresa reprezentantului GPSR UE"
      >
        <Input.TextArea rows={2} />
      </Form.Item>
    </Col>

    <Col xs={24} sm={24} md={12}>
      <Form.Item
        name="gpsrManufacturerName"
        label="Numele producătorului GPSR"
      >
        <Input size="large" />
      </Form.Item>
    </Col>

    <Col xs={24} sm={24} md={12}>
      <Form.Item
        name="gpsrManufacturerEmail"
        label="Adresa de email al producătorului GPSR"
        rules={[{ type: "email", message: "Adaugă un email valid" }]}
      >
        <Input size="large" />
      </Form.Item>
    </Col>

    <Col xs={24}>
      <Form.Item
        name="gpsrManufacturerAddress"
        label="Adresa producătorului GPSR"
      >
        <Input.TextArea rows={2} />
      </Form.Item>
    </Col>

    <Col xs={24}>
      <Form.Item
        name="gpsrSafetyInfo"
        label="Informații de siguranță GPSR (detalii)"
        help=""
      >
        <Input.TextArea rows={3} />
      </Form.Item>
    </Col>
  </Row>
</Cards>

                                    <Form.Item
                                      name="greenTax"
                                      label="Taxa timbru verde (inclusa in pret)"
                                    >
                                      <InputNumber
                                        addonBefore="RON"
                                        placeholder="(Opțional)"
                                        style={{ width: "100%" }}
                                      />
                                    </Form.Item>

                                    <Form.Item
                                      name="oldPrice"
                                      label="Pretul taiat (vechi)"
                                    >
                                      <InputNumber
                                        addonBefore="RON"
                                        placeholder="(Opțional)"
                                        style={{ width: "100%" }}
                                      />
                                    </Form.Item>

                                    <Form.Item
                                      rules={[{ required: true, message: "" }]}
                                      name="weight"
                                      label="Greutate"
                                    >
                                      <InputNumber
                                        style={{ width: "100%" }}
                                        addonBefore="Grame"
                                      />
                                    </Form.Item>

                                    <Form.Item
                                      rules={[{ required: true, message: "" }]}
                                      name="lungime"
                                      label="Lungime"
                                    >
                                      <InputNumber addonBefore="cm" />
                                    </Form.Item>

                                    <Form.Item
                                      rules={[{ required: true, message: "" }]}
                                      name="latime"
                                      label="Latime"
                                    >
                                      <InputNumber addonBefore="cm" />
                                    </Form.Item>

                                    <Form.Item
                                      rules={[{ required: true, message: "" }]}
                                      name="inaltime"
                                      label="Inaltime"
                                    >
                                      <InputNumber addonBefore="cm" />
                                    </Form.Item>

                                    <Form.Item
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Ai uitat să selectezi vârsta",
                                        },
                                      ]}
                                      name="age"
                                      label="Intervalul de varsta"
                                    >
                                      <Select style={{ width: "100%" }}>
                                        {ageOptions?.map((cat) => (
                                          <Option
                                            key={cat}
                                            value={cat.toLowerCase()}
                                          >
                                            {cat}
                                          </Option>
                                        ))}
                                      </Select>
                                    </Form.Item>

                                    <Form.Item
                                      name="youtubeLink"
                                      label="Link youtube"
                                    >
                                      <Input
                                        size="large"
                                        style={{ width: "100%" }}
                                      />
                                    </Form.Item>

                                    <Form.Item
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Ai uitat să selectezi statusul",
                                        },
                                      ]}
                                      name="status"
                                      label="Status"
                                    >
                                      <Radio.Group>
                                        <Radio value="published">Publica</Radio>
                                        <Radio value="draft">In editare</Radio>
                                      </Radio.Group>
                                    </Form.Item>

                                    <Form.Item
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Ai uitat să selectezi un gen",
                                        },
                                      ]}
                                      name="gender"
                                      label="Gen"
                                    >
                                      <Radio.Group>
                                        <Radio value="baieti">Baieti</Radio>
                                        <Radio value="fate">Fete</Radio>
                                        <Radio value="unisex">Unisex</Radio>
                                      </Radio.Group>
                                    </Form.Item>

                                    <Form.Item
                                      style={{ marginBottom: "32px" }}
                                      className="desc-form-item"
                                      label="Descriere"
                                    >
                                      <CKEditor
                                        editor={Editor}
                                        data={description}
                                        onChange={(event, editor) => {
                                          const data = editor.getData();
                                          setDescription(data);
                                        }}
                                      />
                                    </Form.Item>

                                    <Form.Item
                                      name="easyboxAvailability"
                                      className="disponibil-easybox"
                                      label="Disponibil in easybox"
                                      valuePropName="checked"
                                    >
                                      <Switch />
                                    </Form.Item>

                                    
                                    <Form.Item
                                      name="superPret"
                                      className="disponibil-easybox"
                                      label="Super pret"
                                      valuePropName="checked"
                                    >
                                      <Switch />
                                    </Form.Item>

                                    <Form.Item
                                      name="mTitle"
                                      label="Titlul paginii"
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Ai uitat să completezi titlul paginii",
                                        },
                                      ]}
                                    >
                                      <Input size="large" />
                                    </Form.Item>

                                    <Form.Item
                                      name="mDescription"
                                      label="Descrierea paginii"
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Ai uitat să completezi descrierea paginii",
                                        },
                                      ]}
                                    >
                                      <Input size="large" />
                                    </Form.Item>

                                    <Form.Item
                                      name="ogImageWidth"
                                      label="Latime imagine Facebook"
                                    >
                                      <Input size="large" />
                                    </Form.Item>

                                    <Form.Item
                                      name="ogImageHeight"
                                      label="Inaltime imagine Facebook"
                                    >
                                      <Input size="large" />
                                    </Form.Item>

                                    <Form.Item
                                      name="keywords"
                                      label="Adauga cuvinte cheie pentru produsul tau"
                                    >
                                      <Select mode="tags" />
                                    </Form.Item>

                                    <Form.Item
                                      name="stock"
                                      label="Nr bucati in stoc"
                                    >
                                      <InputNumber />
                                    </Form.Item>
                                  </Cards>
                                </div>
                              </Col>
                            </Row>
                          </div>

                          <div className="add-product-block">
                            <Row gutter={15}>
                              <Col xs={24}>
                                <Form.Item
                                  name="file"
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Trebuie să încarci minim o imagine",
                                    },
                                  ]}
                                  className="add-product-content"
                                >
                                  <Cards title="* Imagini cu produsul">
                                    <Dragger {...fileUploadProps}>
                                      <p className="ant-upload-drag-icon">
                                        <FeatherIcon icon="upload" size={50} />
                                      </p>
                                      <Heading
                                        as="h4"
                                        className="ant-upload-text"
                                      >
                                        Trage o imagine aici
                                      </Heading>
                                      <p className="ant-upload-hint">
                                        Sau <span>apasă</span> pentru a alege un
                                        fișier
                                      </p>
                                    </Dragger>
                                  </Cards>
                                </Form.Item>
                              </Col>
                            </Row>
                          </div>

                          <div className="add-product-content">
                            <Row gutter={15}>
                              <Col xs={24}>
                                <Cards
                                  title="Seteaza reducerea pentru achizitii de mai multe produse "
                                  bodyStyle={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                  }}
                                >
                                  <Form.Item
                                    name="discount2"
                                    label="Procentajul de reducere la 2 produse cumparate"
                                  >
                                    <InputNumber addonBefore="%" />
                                  </Form.Item>

                                  <Form.Item
                                    name="discount3"
                                    label="Procentajul de reducere la 3 produse cumparate"
                                  >
                                    <InputNumber addonBefore="%" />
                                  </Form.Item>
                                </Cards>
                              </Col>
                            </Row>
                          </div>

                          <div className="add-form-action">
                            <Form.Item>
                              <Button
                                className="btn-cancel"
                                size="large"
                                onClick={() => {
                                  router.back();
                                }}
                              >
                                Anulează
                              </Button>
                              <Button
                                isLoading={isLoadingLow}
                                htmlType="submit"
                                type="primary"
                                size="large"
                                load
                                raised
                              >
                                Salvează produsul
                              </Button>
                            </Form.Item>
                          </div>
                        </BasicFormWrapper>
                      </Form>
                    ) : (
                      <>Se încarcă...</>
                    )}
                  </AddProductForm>
                </Col>
              </Row>
            </Cards>
          </Col>
        </Row>
      </Main>
    </>
  );
}

export default AddProduct;