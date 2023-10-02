import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useApolloClient } from "@apollo/client";

const GET_USER = gql`
  query GetUser {
    getUser {
      id
      name
      lastname
      email
    }
  }
`;

const Header = () => {
  const client = useApolloClient();
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_USER);

  const logout = () => {
    client.clearStore();
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return null;
  if (!data) {
    logout();
  }

  return (
    <div className="flex justify-between mb-10">
      <p className="mr-2">
        Hola: {data?.getUser.name} {data?.getUser.lastname}
      </p>
      <button
        type="button"
        className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-2 px-2 text-white shadow-md"
        onClick={logout}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Header;
