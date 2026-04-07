import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
<<<<<<< HEAD
	plugins: [reactRouter(), tsconfigPaths()],
=======
  plugins: [reactRouter(), tsconfigPaths()],
>>>>>>> 3c2136e (refactor: add shared routes for the dashboard and change)
});
