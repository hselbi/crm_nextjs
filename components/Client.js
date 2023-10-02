import Swal from "sweetalert2";
import { gql, useMutation } from "@apollo/client";

const DELETE_CLIENT = gql`
  mutation Mutation($deleteClientId: ID!) {
    deleteClient(id: $deleteClientId)
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


const Client = ({ client }) => {

    const [deleteClient] = useMutation(DELETE_CLIENT,{
        update(cache){
            const { getClientsBySeller } = cache.readQuery({ query: GET_CLIENT });

            cache.writeQuery({
                query: GET_CLIENT,
                data: {
                    getClientsBySeller: getClientsBySeller.filter( client  => client.id !== id),
                }
            })
        }
    });

  const { name, lastname, company, email, id } = client;

  const confirmDeleteClient = (id) => {
    console.log("ud", id);
    Swal.fire({
      title: "¿Estas seguro de eliminar el cliente?",
      text: "Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then( async (result) => {
      if (result.isConfirmed) {

        try {
          const {data} =  await deleteClient({
              variables: {
                deleteClientId: id
              }
          });
          console.log(data);
        Swal.fire("Eliminado!", data.deleteClient, "success");
        } catch (error) {
                console.log(error);
        }

      }
    });
  };

  return (
    <tr>
      <td className="border px-4 py-2">
        {name} {lastname}
      </td>
      <td className="border px-4 py-2"> {company}</td>
      <td className="border px-4 py-2"> {email}</td>
      <td className="border px-4 py-2">
        {" "}
        <button
          type="button"
          className="flex justify-center items-center bg-red-800 py-2 px-4 text-white rounded text-xs uppercase font-bold"
          onClick={() => confirmDeleteClient(id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Eliminar
        </button>
      </td>
    </tr>
  );
};

export default Client;
