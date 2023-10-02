import Layout from "../components/Layout";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import Client from "../components/Client";

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

const Home = () => {
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(GET_CLIENT);

  if (loading && !data) return "Cargando";

  if (!data && !error) {
    router.push("/login");
  }

  if (error) {
    return (
      <Layout>
        <div>
          oh! ocurrio un error
          <button
            type="button"
            className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-2 px-2 text-white shadow-md"
            onClick={() => refetch()}
          >
            Reintentar
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-ligth">Clientes</h1>
        <Link href="/newclient">
          <a className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded  text-sm hover:bg-gray-600 mb-3 uppercase font-bold">
            Nuevo cliente
          </a>
        </Link>

        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Nombre</th>
              <th className="w-1/5 py-2">Empresa</th>
              <th className="w-1/5 py-2">Email</th>
              <th className="w-1/5 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data?.getClientsBySeller.map((client) => (
              <Client key={client.id} client={client} />
            ))}
          </tbody>
        </table>
      </Layout>
    </div>  
  );
};

export default Home;
