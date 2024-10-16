import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const createToast = (text, type, time = 3) => {

    toast.dismiss();
    
    const properties = {
        position: "top-right",
        autoClose: time * 1000,
        hideProgressBar: false,
        closeOnClick: true,
        newestOnTop: true,
        // pauseOnHover: true,
        draggable: true,
        theme: "light",
    };

    if (type === 'success')
        toast.success(text, properties);
    else if (type === 'error')
        toast.error(text, properties);
    else if (type === 'warning')
        toast.warning(text, properties);
};

export default createToast;