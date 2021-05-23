module.exports = {
  token: {
    url: "https://oauth.bb.com.br/oauth/token",
    content_Type: "application/x-www-form-urlencoded",
    grant_type: "client_credentials",
    scope: "fgo-pronampe.credito-requisicao",
    clientID: "eyJpZCI6IjU1MjY1MTQtZjg4My00YWU3LWE1MWItNWRjMTg0IiwiY29kaWdvUHVibGljYWRvciI6MCwiY29kaWdvU29mdHdhcmUiOjExNTg0LCJzZXF1ZW5jaWFsSW5zdGFsYWNhbyI6MX0",
    clientSecrete: "eyJpZCI6IjYzY2FhMjktYjU2Zi00ZGYzLThhNjEtNDE3MTc0YTNlYmE2MTJlNmUiLCJjb2RpZ29QdWJsaWNhZG9yIjowLCJjb2RpZ29Tb2Z0d2FyZSI6MTE1ODQsInNlcXVlbmNpYWxJbnN0YWxhY2FvIjoxLCJzZXF1ZW5jaWFsQ3JlZGVuY2lhbCI6MSwiYW1iaWVudGUiOiJwcm9kdWNhbyIsImlhdCI6MTU5OTA3NTA2NDI2M30"
  },
  api: {
    urlBase: "https://api.bb.com.br/fgo-pronampe/v1",
    idClient: "goias-fomento",
    gw_dev_app_key: "f6f53bb40fbbef801345348940050456b9c1a5b6",
    agenteFinanceiro: 15,
    apiComReserva: "/pre-validar-formalizacao-com-reserva",
    apiSemReserva: "/pre-validar-formalizacao-sem-reserva",
    apiCancelaReserva: "/cancelar-reserva-pre-validacao",
  }
};
