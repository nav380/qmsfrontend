// import React, { useState, useEffect } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Notification = () => {
//     const [val, setVal] = useState("");
//     const [messages, setMessages] = useState([]);

//     useEffect(() => {
//         displayNotifications();
//     }, [messages]);

//     const handleSubmit = (type) => {
//         if (val.trim() !== "") {
//             setMessages([...messages, { type, message: val }]);
//             setVal("");
//         } else {
//             toast.error("Please enter a message!");
//         }
//     };
//     const displayNotifications = () => {
//       const uniqueMessages = new Set();
//       messages.forEach(({ type, message }) => {
//           const key = type + message;
//           if (!uniqueMessages.has(key)) {
//               uniqueMessages.add(key);
//               if (type === 'success') {
//                   toast.success(<div>{message}</div>,{ theme: "colored", autoClose: 6000 });
//               } else if (type === 'error') {
//                   toast.error(<div>{message}</div>,{ theme: "colored", autoClose: 6000 });
//               } else if (type === 'warning') {
//                   toast.warning(<div>{message}</div>,{ theme: "colored", autoClose: 6000 });
//               } else {
//                   toast.info(<div>{message}</div>,{ theme: "colored", autoClose: 6000 });
//               }
//           }
//       });
//   };
  
//     return (
//         <>
//             <h1>Notification</h1>
//             <input name="message" value={val} onChange={(e) => setVal(e.target.value)} />
//             <button type='submit' onClick={() => handleSubmit('success')}>Success</button>
//             <button type='submit' onClick={() => handleSubmit('error')}>Error</button>
//             <button type='submit' onClick={() => handleSubmit('warning')}>Warning</button>
//             <ToastContainer />
//         </>
//     );
// };

// export default Notification;



import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationContainer = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={6000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default NotificationContainer;
