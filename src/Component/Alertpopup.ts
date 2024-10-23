import Swal, { SweetAlertIcon } from "sweetalert2";

const AlertPopup = ({message,icon}:{message:string,icon:SweetAlertIcon}) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  return Toast.fire({
    icon: icon,
    title: message,
  });
};

export default AlertPopup;
