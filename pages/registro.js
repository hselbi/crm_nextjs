import { useState } from "react";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, gql } from "@apollo/client";

const CREATE_USER = gql`
  mutation CreateUser($input: UserInput) {
    createUser(input: $input) {
      name
      lastname
      email
    }
  }
`;

const Registro = () => {
  const [message, setMessage] = useState(null);

  const [createUser] = useMutation(CREATE_USER);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      lastname: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es obligatorio"),
      lastname: Yup.string().required("El apellido es obligatorio"),
      email: Yup.string()
        .email("El email es invalido")
        .required("El email es obligatorio"),
      password: Yup.string()
        .required("La contraseña es obligatoria")
        .min(6, "La contraseña deber contener al menos 6 caracteres"),
    }),
    onSubmit: async (data) => {
      // console.log(data);
      const { name, lastname, email, password } = data;
      try {
        const result = await createUser({
          variables: {
            input: {
              name,
              lastname,
              email,
              password,
            },
          },
        });
        setMessage("Usuario creado correctamente.");
        setTimeout(() => {
          setMessage(null);
          router.push("/login");
        }, 3000);
      } catch (e) {
        setMessage(e.message);
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    },
  });

  const showMessage = () => {
    return (
      <div className="bg-white  py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{message}</p>
      </div>
    );
  };

  return (
    <Layout>
      {message && showMessage()}
      <h1 className="text-center text-2xl text-white font-light">
        Registrarse
      </h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-sm">
          <form
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
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
                  formik.errors.name && formik.touched.name ? "border-red-500" : ""
                }`}
                id="name"
                type="text"
                placeholder="Ingrese nombre"
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
                  formik.errors.lastname && formik.touched.lastname ? "border-red-500" : ""
                }`}
                id="lastname"
                type="text"
                placeholder="Ingrese apellido"
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
                htmlFor="email"
              >
                Email
              </label>
              <input
                className={`${"shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tigh focus:outline-none focus:shadow-outline"}  ${
                  formik.errors.email && formik.touched.email ? "border-red-500" : ""
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
                htmlFor="password"
              >
                Contraseña
              </label>
              <input
                className={`${"shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tigh focus:outline-none focus:shadow-outline"}  ${
                  formik.errors.password && formik.touched.password ? "border-red-500" : ""
                }`}
                id="password"
                type="password"
                placeholder="Ingrese contraseña"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.errors.password && formik.touched.password ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 text-sm">
                <p>{formik.errors.password}</p>
              </div>
            ) : null}
            <input
              type="submit"
              className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:cursor-pointer hover:bg-gray-900"
              value="Crear cuenta"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Registro;
