[
  {
    apiVersion: "db.movetokube.com/v1alpha1",
    kind: "Postgres",
    metadata: {
      name: std.extVar("ns"),
      namespace: std.extVar("ns"),
    },
    spec: {
      database: std.extVar("ns"),
      dropOnDelete: false,
    },
  },
  {
    apiVersion: "db.movetokube.com/v1alpha1",
    kind: "PostgresUser",
    metadata: {
      name: std.extVar("ns"),
      namespace: std.extVar("ns"),
    },
    spec: {
      database: std.extVar("ns"),
      privileges: "OWNER",
      role: std.extVar("ns"),
      secretName: "postgres-user",
    },
  },
]
