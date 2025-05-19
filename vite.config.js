import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   define: {
//     global: "window",
//   },
// });

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    server: {
      host: "0.0.0.0",
      port: 5173,
    },
    base: env.VITE_BASE_URL ,//불러온 환경에 있는 변수(VITE_BASE_URL) 값 적용
    plugins: [react()],
    define: {
      global: "window",
    }
  })
};
