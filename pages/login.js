import { useState } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";

const AUTH_USER = gql`
  mutation AuthUser($input: AuthUserInput) {
    authUser(input: $input) {
      token
    }
  }
`;

const Login = () => {
  const [message, setMessage] = useState(null);
  const [authUser] = useMutation(AUTH_USER);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("El email es invalido")
        .required("El email es obligatorio"),
      password: Yup.string().required("La contraseña es obligatoria"),
    }),
    onSubmit: async (formData) => {
      const { email, password } = formData;
      try {
        const { data } = await authUser({
          variables: {
            input: {
              email,
              password,
            },
          },
        });
        setMessage(null);
        const { token } = data.authUser;
        localStorage.setItem("token", token);
        router.push("/");
      } catch (e) {
        setMessage(e.message);
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
      <h1 className="text-center text-2xl text-white font-light">Login</h1>
      {message && showMessage()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-sm">
          <form
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
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
                htmlFor="password"
              >
                Contraseña
              </label>
              <input
                className={`${"shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tigh focus:outline-none focus:shadow-outline"}  ${
                  formik.errors.password && formik.touched.password
                    ? "border-red-500"
                    : ""
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
              value="Iniciar Sesión"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
