import "express-async-errors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./docs/swagger.json";
import cors from "cors";
import { handleErros } from "./errors/errors";
import { contactsRoutes } from "./routes/contacts.routes";
import { customerRoutes } from "./routes/customer.routes";
import { customersLoginRoutes } from "./routes/customerLogin.routes";
import express, { Application, json } from "express";

const app: Application = express();

app.use(json());
app.use(cors());
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/terms", (request, response) => {
  const termsOfService = `
    Bem-vindo aos Termos de Serviço do nosso aplicativo!

    Ao usar nosso aplicativo, você concorda em cumprir estes termos e condições. Eles governam o seu acesso e uso do nosso aplicativo.

    1. Uso do aplicativo
    Você deve usar nosso aplicativo de acordo com todas as leis e regulamentos aplicáveis e não pode usá-lo para qualquer atividade ilegal ou não autorizada.

    2. Privacidade
    Nossa política de privacidade explica como coletamos, usamos e protegemos suas informações pessoais. Ao usar nosso aplicativo, você concorda com nossas práticas de privacidade.

    3. Direitos de propriedade intelectual
    Todo o conteúdo presente no aplicativo, incluindo textos, imagens, logotipos e marcas registradas, é de propriedade exclusiva nossa. Você não tem permissão para usar, reproduzir ou distribuir esse conteúdo sem nossa autorização.

    4. Limitação de responsabilidade
    Não somos responsáveis por quaisquer danos diretos, indiretos, incidentais ou consequenciais resultantes do uso do nosso aplicativo.

    Se você tiver alguma dúvida ou preocupação sobre os Termos de Serviço, entre em contato conosco ti.gabrielrf@gmail.com.

    Obrigado por usar nosso aplicativo!
  `;

  return response.json({
    message: termsOfService,
  });
});

app.use("", customerRoutes);
app.use("", customersLoginRoutes);
app.use("", contactsRoutes);

app.use(handleErros);

export default app;
