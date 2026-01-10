import { createApp } from "./src/app.js";
import { PORT } from "./src/config/env.js";
import { logBlue } from "./src/utils/logs_custom.js";

const app = createApp();

app.listen(PORT, () => {
  logBlue(`Servidor corriendo en http://localhost:${PORT}`);
});
