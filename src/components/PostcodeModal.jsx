import { useEffect, useRef } from "react";

export default function PostcodeModal({ onClose, onComplete }) {
    const elementRef = useRef(null);

    useEffect(() => {
      const script = new window.daum.Postcode({
        oncomplete: function (data) {
          const fullAddress = data.address;
          onComplete(fullAddress);
          onClose();
        },
        onclose: function () {
          onClose();
        },
      });
      script.embed(elementRef.current);
    }, [onClose, onComplete]);
  
    return (
      <>
        {/* 배경 어둡게 */}
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        />
  
        {/* 모달 레이어 */}
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            height: "500px",
            backgroundColor: "#fff",
            zIndex: 1000,
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          }}
        >
          <div ref={elementRef} style={{ width: "100%", height: "100%" }}></div>
        </div>
      </>
    );
  }