[
  {
    apiVersion: "apps/v1",
    kind: "Deployment",
    metadata: {
      name: std.extVar("ns"),
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          app: std.extVar("ns"),
        },
      },
      template: {
        metadata: {
          creationTimestamp: null,
          labels: {
            app: std.extVar("ns"),
          },
          annotations: {
            "sidecar.istio.io/inject": "true",
          },
        },
        spec: {
          containers: [
            {
              name: "app",
              image: std.extVar("image"),
              ports: [
                {
                  name: "http",
                  containerPort: 8888,
                  protocol: "TCP",
                },
              ],
              envFrom: [
                {
                  secretRef: {
                    name: 'sentry',
                  },
                },
                {
                  secretRef: {
                    name: 's3',
                  },
                },
                {
                  secretRef: {
                    name: 'microsoft',
                  },
                },
                {
                  secretRef: {
                    name: 'jwt',
                  },
                },
                {
                  secretRef: {
                    name: 'posthog',
                  },
                },
              ],
              env: [
                {
                  name: "DB_URL",
                  valueFrom: {
                    secretKeyRef: {
                      name: "postgres-user-" + std.extVar("ns"),
                      key: "POSTGRES_URL",
                    },
                  },
                },
                {
                  name: "PUBLIC_DOMAIN",
                  value: std.extVar("ns") + ".stone.nnstd.dev",
                },
                {
                  name: "PORT",
                  value: "8888",
                },
              ],
              resources: {
                limits: {
                  cpu: "3",
                  memory: "4Gi",
                },
                requests: {
                  cpu: "100m",
                  memory: "100Mi",
                },
              },
              terminationMessagePath: "/dev/termination-log",
              terminationMessagePolicy: "File",
              imagePullPolicy: "IfNotPresent",
            },
          ],
          restartPolicy: "Always",
          terminationGracePeriodSeconds: 30,
          dnsPolicy: "ClusterFirst",
          securityContext: {},
          imagePullSecrets: [
            {
              name: "gitlab-registry",
            },
          ],
          schedulerName: "default-scheduler",
        },
      },
      strategy: {
        type: "RollingUpdate",
        rollingUpdate: {
          maxUnavailable: "25%",
          maxSurge: "25%",
        },
      },
      revisionHistoryLimit: 10,
      progressDeadlineSeconds: 600,
    },
  },
]
