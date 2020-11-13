import { InfluxDB, FieldType } from "influx";
import { Schema } from "mongoose";

const { INFLUX_HOST, INFLUX_DB } = process.env;

const influx =
  INFLUX_HOST && INFLUX_DB
    ? new InfluxDB({
        host: INFLUX_HOST,
        database: INFLUX_DB,
        schema: [
          {
            measurement: "graphql_request",
            fields: {
              query: FieldType.STRING,
              duration: FieldType.INTEGER,
              user_id: FieldType.STRING,
              user_email: FieldType.STRING,
              errors: FieldType.STRING,
              status: FieldType.STRING
            },
            tags: ["user_id", "user_email", "status"]
          },
          {
            measurement: "api_log",
            fields: {
              message: FieldType.STRING,
              data: FieldType.STRING,
              severity: FieldType.STRING
            },
            tags: ["severity"]
          }
        ]
      })
    : null;

const initInfluxDb = async () => {
  if (influx && INFLUX_DB) {
    try {
      const names = await influx.getDatabaseNames();
      if (!names.includes(INFLUX_DB)) {
        return influx.createDatabase(INFLUX_DB);
      }
    } catch (e) {}
  }
};

initInfluxDb();

const apiLog = (severity: string, message: string, data?: any) => {
  const severityColor =
    severity === "error"
      ? "\x1b[31m"
      : severity === "warn"
      ? "\x1b[33m"
      : severity === "info"
      ? "\x1b[34m"
      : "\x1b[37m";

  console.log(`${severityColor}[${severity}]\x1b[0m ${message}`);

  if (influx) {
    try {
      influx.writePoints([
        {
          measurement: "api_log",
          tags: { severity },
          fields: {
            message,
            data: data ? JSON.stringify(data) : "",
            severity
          }
        }
      ]);
    } catch (e) {}
  }
};

export default {
  error: (message: string, data?: any): void => apiLog("error", message, data),
  warn: (message: string, data?: any): void => apiLog("warn", message, data),
  info: (message: string, data?: any): void => apiLog("info", message, data)
};

export const apolloLogPlugin = {
  requestDidStart(requestContext) {
    const start = new Date().getTime();
    return {
      willSendResponse(requestContext) {
        const { user } = requestContext.context || {};
        const { query } = requestContext.request;
        const duration = new Date().getTime() - start;

        let errors = "";
        if (requestContext.errors && requestContext.errors.length) {
          errors = JSON.stringify(
            requestContext.errors.map(e => ({
              ...e,
              stack: e.stack.toString()
            }))
          );
        }
        if (influx) {
          const user_id = user ? user.userID : "";
          const user_email = user ? user.email : "";
          const status = errors ? "error" : "success";

          try {
            influx.writePoints([
              {
                measurement: "graphql_request",
                tags: { user_id, user_email, status },
                fields: {
                  query,
                  duration,
                  user_id,
                  user_email,
                  errors,
                  status
                }
              }
            ]);
          } catch (e) {}
        }
      }
    };
  }
};
