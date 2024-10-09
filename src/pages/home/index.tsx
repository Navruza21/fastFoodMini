import type { MenuProps } from "antd";
import {
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Segmented,
  Space,
  Typography,
} from "antd";
import "./style.css";
import React, { useEffect, useMemo, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLogoVk } from "react-icons/io5";
import { BiLogoTelegram } from "react-icons/bi";
import { css } from "@emotion/react";
import { Category, Order, Product } from "@src/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@src/store";
import axios from "axios";
import { setProducts } from "@src/store/slices/productsSlice";
import { setCategory } from "@src/store/slices/categoriesSlice";
import { clearBasket, setBasket } from "@src/store/slices/basketSlice";
import { Roll, Slide } from "react-awesome-reveal";
import { setOrder } from "@src/store/slices/orderSlice";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState<string>("Бургеры");
  const products: Product[] = useSelector(
    (state: RootState) => state.products.products
  );
  const categories: Category[] = useSelector(
    (state: RootState) => state.categories.category
  );
  const basket: Product[] = useSelector(
    (state: RootState) => state.basket.basket
  );
  const order: Order[] = useSelector((state: RootState) => state.order.order);

  const dispatch = useDispatch();
  const [addProd, setAddProd] = useState<Product | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState<true | false>(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [counter, setCounter] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<string>("самовывоз");
  // const [selectedOrder, setSelectedOrder] = useState<Product[]>(basket);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseProducts = await axios.get(
          "https://b5a7010fa4e2f8d2.mokky.dev/products"
        );
        dispatch(setProducts(responseProducts.data));

        const responseCategory = await axios.get(
          "https://b5a7010fa4e2f8d2.mokky.dev/categories"
        );
        dispatch(setCategory(responseCategory.data));

        const responseBasket = await axios.get(
          "https://b5a7010fa4e2f8d2.mokky.dev/basket"
        );

        dispatch(setBasket(responseBasket.data));

        const responseOrder = await axios.get(
          "https://b5a7010fa4e2f8d2.mokky.dev/orders"
        );

        dispatch(setOrder(responseOrder.data));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);
  //basket
  const showBasketModal = () => {
    setIsModalVisible(true);
    dispatch(setBasket(basket));
    console.log("selected order", basket);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const totalPrice = basket.reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );
  const handleBasketMinus = async (productId?: number) => {
    const productIndex = basket.findIndex((item) => item.id === productId);
    if (productIndex !== -1 && basket[productIndex].count > 0) {
      const updatedProduct = {
        ...basket[productIndex],
        count: basket[productIndex].count - 1,
      };
      setCounter(basket[productIndex].count - 1);
      const newBasket =
        updatedProduct.count > 0
          ? [
              ...basket.slice(0, productIndex),
              updatedProduct,
              ...basket.slice(productIndex + 1),
            ]
          : [
              ...basket.slice(0, productIndex),
              ...basket.slice(productIndex + 1),
            ];
      dispatch(setBasket(newBasket));
      console.log("newBasket and basket", newBasket, basket);
    }
  };
  const handleBasketPlus = (productId?: number) => {
    const productIndex = basket.findIndex((item) => item.id === productId);
    if (productIndex !== -1) {
      const updatedProduct = {
        ...basket[productIndex],
        count: basket[productIndex].count + 1,
      };
      const baskett = [
        ...basket.slice(0, productIndex),
        updatedProduct,
        ...basket.slice(productIndex + 1),
      ];
      dispatch(setBasket(baskett));
      console.log("basket", baskett, basket);
    }
  };

  // product
  const showModal = (product: Product) => {
    console.log("product", product);
    const inBasketIndex = basket.findIndex((item) => item.id == product.id);
    const inbasket = basket[inBasketIndex];
    setCounter(inbasket?.count ?? 1);
    setAddProd(product);
    setIsModalOpen(true);
    return;
  };
  const handleCancell = () => {
    setIsModalOpen(false);
  };
  const handleOkk = () => {
    setIsModalOpen(false);
  };

  const handleProductModalPlus = () => {
    setCounter(counter + 1);
  };
  const handleProductModalMinus = () => {
    counter !== 1 ? setCounter(counter - 1) : setCounter(counter);
  };

  const addToBasket = async (product: Product | undefined) => {
    const newBasket = structuredClone(basket);
    const inBasketIndex = newBasket.findIndex((item) => item.id == product?.id);
    const inbasket = newBasket[inBasketIndex];

    if (product) {
      if (inbasket) {
        inbasket.count = counter;
        newBasket.splice(inBasketIndex, 1, inbasket);

        dispatch(setBasket(newBasket));
      } else {
        console.log("product", product);

        try {
          const response = await axios.post(
            "https://b5a7010fa4e2f8d2.mokky.dev/basket",
            {
              id: product.id,
              image: product.image,
              title: product.title,
              price: product.price,
              weight: product.weight,
              desc: product.desc,
              compound: product.compound,
              calories: product.calories,
              categoryId: product.categoryId,
              count: counter,
            }
          );
          dispatch(setBasket([...basket, response.data]));
          console.log("Product added to basket:", response.data);
        } catch (error: any) {
          if (error.response) {
            // Сервер ответил с кодом состояния, который выходит за пределы 2xx
            console.error("Error response:", error.response.data);
          } else if (error.request) {
            // Запрос был сделан, но ответа не было получено
            console.error("Error request:", error.request);
          } else {
            // Произошла ошибка при настройке запроса
            console.error("Error message:", error.message);
          }
        }
      }
    }
    setCounter(1);
    setIsModalOpen(false);
  };

  // order
  const onFinish = async (values: {
    firstName: string;
    lastName: string;
    phone: string;
    dostavkaTuri: "Самовывоз" | "Доставка";
    dom?: string;
    etaj?: number;
    domofon?: string;
  }) => {
    console.log("Form values:", values);
    try {
      const response = await axios.post(
        "https://b5a7010fa4e2f8d2.mokky.dev/orders",
        {
          id: values.etaj,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          dostavkaTuri: values.dostavkaTuri,
          dom: values.dom,
          etaj: values.etaj,
          domofon: values.domofon,
          orders: basket,
          totalPrice: totalPrice,
        }
      );
      dispatch(setOrder([...order, response.data]));
      console.log("Product added to order:", response.data);
      setIsModalVisible(false);
      form.getFieldValue;
      dispatch(clearBasket());
      message.success("ваш заказ оформлен");
    } catch (error: any) {
      if (error.response) {
        // Сервер ответил с кодом состояния, который выходит за пределы 2xx
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        // Запрос был сделан, но ответа не было получено
        console.error("Error request:", error.request);
      } else {
        // Произошла ошибка при настройке запроса
        console.error("Error message:", error.message);
      }
    }
    return values;
  };

  const items: MenuProps["items"] = useMemo(
    () => [
      {
        label: "Аккаунт",
        key: "admin",
      },
      {
        label: "Настройки",
        key: "nastroyki",
      },
    ],
    []
  );

  // filter product
  const selectcatItem = categories.find(
    (item) => item.title == selectedCategory
  );

  const filteredProducts = products.filter(
    (product) => product.categoryId === selectcatItem?.id
  );

  console.log("filter", selectedCategory, filteredProducts);

  const navigate = useNavigate();

  const onClick: MenuProps["onClick"] = ({ key }) => {
    message.info("Вы вошли в админ панель");
    if (key === "admin") {
      navigate("/admin");
    }
  };
  return (
    <div>
      <div className="bg-[#f9f9f9]">
        <div
          style={{
            background: "url('/ellipse.svg')",
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
          className="flex flex-col items-center py-7"
        >
          <header className="md:container flex justify-between">
            <img src={"/logo1.svg"} alt="" />
            <div>
              <Dropdown menu={{ items, onClick }}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <Button type="text">
                      <CgProfile className="text-xl" />
                    </Button>
                  </Space>
                </a>
              </Dropdown>
            </div>
          </header>

          <div className="flex items-center my-10 hamburger">
            <Roll duration={2000} triggerOnce>
              {" "}
              <img src="/pic.png" alt="" />
            </Roll>
            <Slide direction={"right"} triggerOnce>
              {" "}
              <div>
                <Typography.Title level={1} className="">
                  Только самые <br></br>
                  <span className="text-secondary">сочные бургеры!</span>
                </Typography.Title>
                <Typography className="text-white mt-12">
                  Бесплатная доставка от 599₽
                </Typography>
              </div>
            </Slide>
          </div>
        </div>
        <div className="sm:container my-10 mx-auto px-3">
          <Slide duration={2000} triggerOnce>
            {" "}
            <div className=" overflow-x-auto min-w-full">
              <Segmented<string>
                value={selectedCategory}
                options={categories.map((item, index) => ({
                  label: (
                    <Slide
                      duration={index * 100 + 1500}
                      triggerOnce
                      key={item.id}
                    >
                      {" "}
                      <span
                        className="flex items-center gap-2 py-2"
                        onClick={() => {
                          setSelectedCategory(item.title);
                        }}
                      >
                        <img src={item.icon} alt="" className="block" />
                        <Typography>{item.title}</Typography>
                      </span>
                    </Slide>
                  ),
                  value: item.title,
                  className:
                    "block min-w-[120px] bg-white hover:!bg-white !rounded-2xl",
                }))}
                onChange={(value) => {
                  console.log(value); // string
                  setSelectedCategory(value);
                }}
                // block
                className="mb-6 bg-transparent"
                css={css`
                  .ant-segmented-group {
                    gap: 14px;
                  }
                  .ant-segmented-item-selected,
                  .ant-segmented-item:hover {
                    background: #ffab08 !important;
                  }
                `}
              />
            </div>
          </Slide>

          <Row gutter={[20, 20]} className="">
            {" "}
            <Col md={8} lg={6} className="py-5">
              <Slide triggerOnce>
                <div className="rounded-[12px] bg-white p-3 m-0">
                  {" "}
                  <div className="flex flex-row justify-between">
                    {" "}
                    <Typography.Title level={3} className="ms-2">
                      {" "}
                      Корзина
                    </Typography.Title>
                    <Button>{basket.length}</Button>
                  </div>
                  <div>
                    {basket?.map((item) => (
                      <div key={item.id}>
                        <hr />
                        <div className="flex flex-row gap-3  align-items-center justify-content-center my-3">
                          {" "}
                          <div className="basis-2/7">
                            <img
                              src={item.image}
                              alt=""
                              className="w-[80px]  h-[60px] rounded-[12px] m-2 "
                            />
                          </div>
                          <div className="basis-3/7">
                            {" "}
                            <p className="mt-1">{item.title}</p>
                            <p className="text-gray-500 text-[12px] mt-1">
                              {item.weight}г
                            </p>
                            <p className="text-bold my-1">{item.price}₽</p>
                          </div>
                          <div className="basis-2/7 grid grid-cols-3 gap-2 h-[35px] bg-[#f2f2f3] rounded-[12px] py-2 px-4 mt-6 ms-0 align-middle items-center ">
                            <button
                              className=""
                              onClick={() => handleBasketMinus(item.id)}
                            >
                              <FaMinus className="text-[10px]" />
                            </button>
                            <p className="">{item.count}</p>
                            <button
                              className=""
                              onClick={() => handleBasketPlus(item.id)}
                            >
                              <FaPlus className="text-[10px]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <hr />
                  <div className=" flex flex-row justify-between my-2">
                    <p>Итого</p>
                    <p>{totalPrice} ₽</p>
                  </div>
                  <Button
                    type="primary"
                    className="py-5 font-bold w-full"
                    onClick={() => {
                      showBasketModal();
                    }}
                  >
                    Оформить заказ
                  </Button>
                  <div className="flex flex-row gap-3 items-center py-5 ">
                    <TbTruckDelivery className="text-[20px]" />
                    <p>Бесплатная доставка</p>
                  </div>
                </div>
              </Slide>
            </Col>
            {/* basketmodal */}
            <Modal
              className=" !w-[700px] "
              open={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={null}
            >
              <div className="flex flex-row gap-5 p-0 m-0 bg-[#f9f9f9] rounded-lg h-[455px]">
                <div className="bg-[rgb(255, 171, 8)] basis-1/2 m-0">
                  <img
                    src={"/pic1.png"}
                    alt=""
                    className="w-full h-full rounded-s-lg"
                  />
                </div>
                <div className="flex flex-col gap-5 mt-5 basis-1/2 m-5 ms-2 bg-[#f9f9f9]">
                  <p className="text-[18px] text-bold">Корзина</p>
                  <Form form={form} onFinish={onFinish}>
                    <Form.Item
                      className="mt-0"
                      name="firstName"
                      rules={[
                        {
                          required: true,
                          message: "Пожалуйста, введите своё имя!",
                        },
                      ]}
                    >
                      <Input placeholder="Ваше имя" />
                    </Form.Item>
                    <Form.Item className="mt-0" name="lastName">
                      <Input placeholder="Ваше фамилия" />
                    </Form.Item>
                    <Form.Item
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Пожалуйста, введите свой контак!",
                        },
                      ]}
                    >
                      <Input placeholder="Контакт" />
                    </Form.Item>
                    <Form.Item name="doctavkaTuri">
                      <Radio.Group
                        onChange={(e: any) => {
                          setSelectedOption(e.target.value);
                        }}
                      >
                        <Radio value="самовывоз">Самовывоз</Radio>
                        <Radio value="доставка">Доставка</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {selectedOption === "доставка" && (
                      <>
                        <Form.Item
                          name="dom"
                          rules={[
                            {
                              required: true,
                              message: "Пожалуйста, введите свой адресс!",
                            },
                          ]}
                        >
                          <Input placeholder="Дом" />
                        </Form.Item>{" "}
                        <div className="flex flex-row gap-6">
                          <Form.Item name="etaj" className="w-[47%]">
                            <Input placeholder="Этаж" />
                          </Form.Item>
                          <Form.Item name="domofon" className="w-[47%]">
                            <Input placeholder="Домофон" />
                          </Form.Item>
                        </div>
                      </>
                    )}

                    <Form.Item className="!w-full">
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full"
                      >
                        Оформить
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </Modal>
            <Col md={16} lg={18} className="py-5 rounded">
              <Row gutter={[20, 20]}>
                {filteredProducts?.map((item) => (
                  <Col xs={24} sm={12} md={12} lg={8} key={item.id}>
                    {" "}
                    <Slide direction="right" duration={1000} triggerOnce>
                      {" "}
                      <div className="m-1 p-3 rounded-[12px] bg-white">
                        {" "}
                        <img
                          src={item.image}
                          alt=""
                          className="w-full rounded-[12px] h-[190px] object-cover"
                        />
                        <p className="font-bold text-[20px] mt-2">
                          {item.price}₽
                        </p>
                        <p>{item.title}</p>
                        <p className="text-gray-500 mt-5 mb-2">
                          {item.weight}г
                        </p>
                        <button
                          className="bg-[#f2f2f3] rounded-[12px]  w-full p-1  hover:!bg-[#ffab08]"
                          onClick={() => {
                            showModal(item);
                          }}
                        >
                          Добавить
                        </button>
                      </div>
                    </Slide>
                  </Col>
                ))}
              </Row>
            </Col>
            {/* productmodal */}
            <Modal
              className=" !w-[800px] "
              open={isModalOpen}
              onOk={handleOkk}
              onCancel={handleCancell}
              footer={null}
            >
              <div className="p-5 m-5">
                {" "}
                <div className="flex flex-row gap-5 p-2">
                  <div className=" basis-1/2">
                    <img
                      src={addProd?.image}
                      className="rounded-[12px] w-full mt-9"
                    />
                  </div>
                  <div className="basis-1/2">
                    <p className="text-black text-bold text-[18px]">
                      {addProd?.title}
                    </p>
                    <p>{addProd?.desc}</p>
                    <p className="pt-2">Состав:</p>
                    <ul>
                      {addProd?.compound.map((item: string) => {
                        return <li key={item}>{item}</li>;
                      })}
                    </ul>
                    <div className="text-gray-500 flex flex-row gap-2 text-[14px] pt-2">
                      <p>{addProd?.weight}г,</p>
                      <p>ккал {addProd?.calories},</p>
                      <p className="font-bold">{addProd?.price}₽</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-5 p-2 mt-5">
                  <button
                    className=" rounded-[12px] w-[300px] p-1 !bg-[#ffab08] basis-1/2"
                    onClick={() => {
                      addToBasket(addProd);
                      console.log("add button");
                    }}
                  >
                    Добавить
                  </button>
                  <div className="grid grid-cols-3 gap-2 basis-1/2">
                    <div className=" basis-1/2 flex justify-center items-center bg-[#F2F2F3] rounded-[12px] h-[40px] p-3">
                      <Button
                        onClick={() => handleProductModalMinus()}
                        style={{
                          border: "none",
                          background: "transparent",
                        }}
                      >
                        -
                      </Button>
                      <p> {counter} </p>
                      <Button
                        onClick={() => handleProductModalPlus()}
                        style={{
                          border: "none",
                          background: "transparent",
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </Row>
        </div>
      </div>

      <footer className="container grid grid-cols-4 gap-2 pb-8">
        <div className="col-span-2 ">
          <img src={"/logo.svg"} alt="" />
          <div className="text-[12px] mt-7">
            <p>© YouMeal, 2022</p>
            <p>Design: Anastasia Ilina</p>
          </div>
        </div>
        <div className="">
          <p className="text-[24px]">Номер для заказа</p>
          <div className="flex flex-row gap-2 items-center mt-3">
            <FaPhoneAlt />
            <p className="text-[16px] ">+7(930)833-38-11</p>
          </div>
        </div>
        <div className="">
          <p className="text-[24px]">Мы в соцсетях</p>
          <div className=" mt-3 flex flex-row gap-3">
            <div className="bg-[#ff7020] rounded-full items-center p-1">
              {" "}
              <IoLogoVk className="text-white" />
            </div>{" "}
            <div className="bg-[#ff7020] rounded-full  items-center p-1">
              {" "}
              <BiLogoTelegram className="text-white" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
