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
        "istio-system/nnstd"
      ],
      hosts: [
        std.extVar("ns") + ".stone.nnstd.dev",
        "api.sknnr.co"
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
            "api.sknnr.co"
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
