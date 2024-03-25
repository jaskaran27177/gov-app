import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function withAuthCheck(WrappedComponent) {
  return function ProtectedRoute(props) {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
      const verifyToken = async () => {
        try {
          const response = await fetch(
            "http://localhost:8000/api/token/verify/",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const data = await response.json();
          console.log(data);
          if (data.status !== 200) {
            navigate("/login");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      verifyToken();
    }, [accessToken, navigate]);

    return <WrappedComponent {...props} />;
  };
}
export default withAuthCheck;
