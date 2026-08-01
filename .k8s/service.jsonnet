[
  {
    apiVersion: "v1",
    kind: "Service",
    metadata: {
      name: std.extVar("ns"),
      namespace: std.extVar("ns"),
    },
    spec: {
      ports: [
        {
          name: "http",
          protocol: "TCP",
          port: 80,
          targetPort: "http",
        },
      ],
      selector: {
        app: std.extVar("ns"),
      },
      type: "ClusterIP",
      sessionAffinity: "None",
      ipFamilies: [
        "IPv4",
      ],
      ipFamilyPolicy: "SingleStack",
      internalTrafficPolicy: "Cluster",
    },
  },
]
