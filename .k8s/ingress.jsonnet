[
  {
    apiVersion: "networking.istio.io/v1alpha3",
    kind: "VirtualService",
    metadata: {
      name: std.extVar("ns"),
      namespace: std.extVar("ns"),
    },
    spec: {
      gateways: [
        std.extVar("ns"),
      ],
      hosts: [
        std.extVar("ns") + ".nnstd.dev",
      ],
      http: [
        {
          headers: {
            request: {
              add: {
                "x-forwarded-proto": "https",
              },
            },
          },
          route: [
            {
              destination: {
                host: std.extVar("ns"),
              },
            },
          ],
        },
      ],
    },
  },
  {
    apiVersion: "networking.istio.io/v1alpha3",
    kind: "Gateway",
    metadata: {
      name: std.extVar("ns"),
      namespace: std.extVar("ns"),
    },
    spec: {
      selector: {
        istio: "ingressgateway",
      },
      servers: [
        {
          hosts: [
            std.extVar("ns") + ".nnstd.dev",
          ],
          port: {
            name: "http",
            number: 80,
            protocol: "HTTP",
          },
        },
      ],
    },
  },
]
