import { useState } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
const NEW_CLIENT = gql`
  mutation CreateClient($input: ClientInput) {
    createClient(input: $input) {
      id
      name
      lastname
      company
      email
      phone
      dni
    }
  }
`;

const GET_CLIENT = gql`
  query ExampleQuery {
    getClientsBySeller {
      id
      name
      lastname
      company
      email
      phone
      dni
      seller
    }
  }
`;

const NewClient = () => {

  const [message, setMessage] = useState(null);
  const router = useRouter();  
  const [createClient] = useMutation(NEW_CLIENT,{
      update(cache, {data: { createClient }}){
          const {getClientsBySeller} = cache.readQuery({ query: GET_CLIENT })

          cache.writeQuery({
              query: GET_CLIENT,
              data: {
                getClientsBySeller: [...getClientsBySeller, createClient]
              }
          })
      }
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      lastname: "",
      company: "",
      email: "",
      phone: "",
      dni: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es obligatorio"),
      lastname: Yup.string().required("El apellido es obligatorio"),
      company: Yup.string().required("La empresa es obligatoria"),
      email: Yup.string()
        .email("El email es invalido")
        .required("El email es obligatorio"),
      phone: Yup.number().required("El telefono es obligatorio"),
      dni: Yup.number().required("el Dni es obligatorio"),
    }),
    onSubmit: async (formData) => {
      const { name, lastname, company, email, phone, dni } = formData;
      try {
        const { data } = await createClient({
          variables: {
            input: {
              name,
              lastname,
              company,
              email,
              phone,
              dni: dni.toString(),
            },
          },
        });
        router.push('/');
      } catch (e) {
        setMessage(e.message);
      }
    },
  });

  const showMessage = () => {
    return (
      <div className="text-red-500  py-2 px-3 w-full my-3  text-center mx-auto">
        <p>{message}</p>
      </div>
    );
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-ligth">Nuevo Cliente</h1>
      {message && showMessage()}
      <div className="flex justify-center  mt-5">
        <div className="w-full max-w-lg">
          <form
            className="bg-white shadow-md px-8 pt-6 pb-8 mb-5"
            onSubmit={formik.handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Nombre
              </label>
              <input
                className={`${"shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tigh focus:outline-none focus:shadow-outline"}  ${
                  formik.errors.name && formik.touched.name
                    ? "border-red-500"
                    : ""
                }`}
                id="name"
                type="text"
                placeholder="Ingrese Nombre"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.errors.name && formik.touched.name ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 text-sm">
                <p>{formik.errors.name}</p>
              </div>
            ) : null}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="lastname"
              >
                Apellido
              </label>
              <input
                className={`${"shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tigh focus:outline-none focus:shadow-outline"}  ${
                  formik.errors.lastname && formik.touched.lastname
                    ? "border-red-500"
                    : ""
                }`}
                id="lastname"
                type="text"
                placeholder="Ingrese Apellido"
                value={formik.values.lastname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.errors.lastname && formik.touched.lastname ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 text-sm">
                <p>{formik.errors.lastname}</p>
              </div>
            ) : null}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="company"
              >
                Empresa
              </label>
              <input
                className={`${"shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tigh focus:outline-none focus:shadow-outline"}  ${
                  formik.errors.company && formik.touched.company
                    ? "border-red-500"
                    : ""
                }`}
                id="company"
                type="text"
                placeholder="Ingrese Empresa"
                value={formik.values.company}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.errors.company && formik.touched.company ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 text-sm">
                <p>{formik.errors.company}</p>
              </div>
            ) : null}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className={`${"shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tigh focus:outline-none focus:shadow-outline"}  ${
                  formik.errors.email && formik.touched.email
                    ? "border-red-500"
                    : ""
                }`}
                id="email"
                type="email"
                placeholder="Ingrese Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.errors.email && formik.touched.email ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 text-sm">
                <p>{formik.errors.email}</p>
              </div>
            ) : null}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="phone"
              >
                Telefono
              </label>
              <input
                className={`${"shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tigh focus:outline-none focus:shadow-outline"}  ${
                  formik.errors.phone && formik.touched.phone
                    ? "border-red-500"
                    : ""
                }`}
                id="phone"
                type="tel"
                placeholder="Ingrese Telefono"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.errors.phone && formik.touched.phone ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 text-sm">
                <p>{formik.errors.phone}</p>
              </div>
            ) : null}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="phone"
              >
                Dni
              </label>
              <input
                className={`${"shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tigh focus:outline-none focus:shadow-outline"}  ${
                  formik.errors.dni && formik.touched.dni
                    ? "border-red-500"
                    : ""
                }`}
                id="dni"
                type="number"
                placeholder="Ingrese dni"
                value={formik.values.dni}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.errors.dni && formik.touched.dni ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 text-sm">
                <p>{formik.errors.dni}</p>
              </div>
            ) : null}
            <input
              type="submit"
              className="bg-gray-700 w-full mt-5  p-2  text-white uppercase font-bold hover:cursor-pointer hover:bg-gray-900"
              value="Guardar"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewClient;
