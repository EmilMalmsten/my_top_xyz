import { Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function ToplistCatalog({ title, endpoint }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    import.meta.env.VITE_API_URL + endpoint,
                    {
                        params: {
                            page_size: "5",
                        },
                    }
                );
                console.log(response.data);
                setItems(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <h5>{title}</h5>
            <ol>
                {items.map((item) => (
                    <li key={item.toplist_id}>
                        <Link to={`/toplists/${item.toplist_id}`}>
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ol>
            <Link to={endpoint}>
                <Button variant="outline-dark">View more</Button>
            </Link>
        </>
    );
}

ToplistCatalog.propTypes = {
    title: PropTypes.string.isRequired,
    endpoint: PropTypes.string.isRequired,
};

export default ToplistCatalog;
