# Automatización (n8n / Make / Zapier), webhooks y APIs: amenazas, capas de protección y límites

Fecha de acceso de todas las fuentes: 2026-11-05. Etiquetas de confianza: [VERIFICADO] = leído en fuente primaria/autorizada; [ESTIMACIÓN] = cifra de un tercero que depende de su metodología; [HIPÓTESIS] = inferencia propia; [NO VERIFICADO] = solo visto en un resumen o fuente secundaria.

## 1. Avisos de seguridad y CVE de n8n

### Takeaway
n8n tuvo una ola de vulnerabilidades críticas desde finales de 2025 (RCE por inyección de expresiones, lectura de ficheros sin autenticación vía webhook/form, escapes de sandbox), al menos una está en CISA KEV y su repositorio en GitHub tiene unas 24 páginas de avisos (unos 240). Parchear es una capa en sí misma, no una tarea puntual.

### Cited Findings
- **CVE-2025-68613**: RCE en el sistema de evaluación de expresiones de los workflows (aislamiento insuficiente de expresiones del usuario). Afecta a 0.211.0 hasta antes de 1.120.4 / 1.121.1 / 1.122.0. Requiere autenticación. Crítica. [VERIFICADO] (NVD; sin fecha de publicación capturada) — [NVD](https://nvd.nist.gov/vuln/detail/CVE-2025-68613); [Canadian Cyber Centre AL26-001, alerta del 7-ene-2026](https://www.cyber.gc.ca/en/alerts-advisories/al26-001-vulnerabilities-affecting-n8n-cve-2026-21858-cve-2026-21877-cve-2025-68613)
- **CVE-2025-68613 está en CISA KEV desde el 11-mar-2026** y se explota activamente. [VERIFICADO vía CSA; no comprobado directamente en el catálogo KEV] — [CSA Research Note, publicada el 14-mar-2026 y modificada el 20-may-2026](https://labs.cloudsecurityalliance.org/research/csa-research-note-n8n-rce-ai-pipeline-attack-surface-2026031/)
- **CVE-2026-21858 ("Ni8mare")**: mala validación de entrada (CWE-20, confusión de content-type) al gestionar ficheros en webhooks/formularios. Permite a un atacante sin autenticar leer ficheros del servidor y puede acabar en toma total del sistema. Afecta a 1.65.0 hasta antes de 1.121.0; corregida en 1.121.0. CVSS 3.1 de 10.0 (CNA GitHub). Descubierta por Cyera, notificada en nov-2025 y publicada el 7/8-ene-2026. [VERIFICADO] — [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-21858); [Cyera](https://www.cyera.com/research/ni8mare-unauthenticated-remote-code-execution-in-n8n-cve-2026-21858); [aviso de n8n en su comunidad, 8-ene-2026](https://community.n8n.io/t/security-advisory-security-vulnerability-in-n8n-versions-1-65-1-120-4/247305)
- **Encadenamiento**: la lectura de ficheros sin autenticación de CVE-2026-21858 (sirve para robar secretos o la sesión) más el RCE autenticado de CVE-2025-68613 dan una toma completa. [VERIFICADO como análisis de terceros] — [Dataminr intel brief](https://www.dataminr.com/resources/intel-brief/ni8mare-n8n-exploit-ch/)
- **CVE-2026-21877**: citada en la misma alerta canadiense como alta severidad. No extraje detalles. [NO VERIFICADO] — [Cyber Centre AL26-001](https://www.cyber.gc.ca/en/alerts-advisories/al26-001-vulnerabilities-affecting-n8n-cve-2026-21858-cve-2026-21877-cve-2025-68613)
- **Lote del 4-feb-2026** (según la tabla de Endor Labs). [VERIFICADO como fuente secundaria; las versiones no se compararon con NVD]:
  - CVE-2026-25049 (GHSA-6cqr-8cfr-67f8): escape de expresión o sandbox por confusión de tipos que da RCE. Crítica. Versiones afectadas <2.5.2 y <1.123.17.
  - CVE-2026-25056, -25053, -25052 y -25115: críticas.
  - CVE-2026-25055: alta.
  - Fuentes: [Endor Labs, 4-feb-2026](https://www.endorlabs.com/learn/cve-2026-25049-n8n-rce); [Security Bulletin de n8n, 6-feb-2026](https://community.n8n.io/t/security-bulletin-february-6-2026/261682)
  - Contradicción: el TL;DR de Endor dice en una frase "unauthenticated" y en la siguiente "authenticated". Hay que tratarla como autenticada mientras no se confirme en el GHSA.
- **CVE-2026-27577 y CVE-2026-27493**: según CSA, críticas y explotadas activamente en mar-2026. [NO VERIFICADO en NVD] — [CSA](https://labs.cloudsecurityalliance.org/research/csa-research-note-n8n-rce-ai-pipeline-attack-surface-2026031/)
- **CVE-2026-72767**: RCE autenticada en el nodo Git. [NO VERIFICADO; solo aparece en la base de datos de SentinelOne] — [SentinelOne](https://www.sentinelone.com/vulnerability-database/cve-2026-72767/)
- **Avisos GHSA publicados el 28-oct-2026** (página 1 de 24 del listado). [VERIFICADO] — [GitHub n8n-io/n8n advisories](https://github.com/n8n-io/n8n/security/advisories)
  - Altos: nodos Code obsoletos que permiten ejecutar código en el proceso principal (GHSA-9p7v-45m2-wxgj) y configuración insegura de GraphicsMagick (GHSA-f2cw-9483-7vcp).
  - Moderados:
    - SQLi en el Vector Store de OracleDB (GHSA-2x68-96jw-5r6c)
    - una petición sin autenticar puede resetear el secreto de verificación del Asana Trigger (GHSA-mx4r-96jx-v278)
    - secuestro de cuenta OAuth mediante un callback sin autenticar (GHSA-426f-xmcv-g8pg)
    - open redirect en el registro dinámico de clientes OAuth de MCP (GHSA-rc3w-8jc8-7x3w)
    - la herramienta de subida de Browser Use lee ficheros arbitrarios (GHSA-9qx8-fhxv-w794)
    - los nodos con credenciales reenvían cabeceras de autenticación en redirecciones cross-origin (GHSA-prmc-fg87-r4gh)
    - el chat embebido del Chat Trigger no aplica la autenticación de usuario en todas las peticiones (GHSA-pwj5-wwm6-g83j)
- **Cadena de suministro**: Endor Labs documentó 8 paquetes npm maliciosos que se hacían pasar por community nodes de n8n (uno imitaba Google Ads y superó las 8.000 descargas). Pedían credenciales OAuth y las exfiltraban. [VERIFICADO vía CSA] — [CSA](https://labs.cloudsecurityalliance.org/research/csa-research-note-n8n-rce-ai-pipeline-attack-surface-2026031/)

### Inferences
- [HIPÓTESIS] Tipos de vulnerabilidad recurrentes: inyección de expresiones o escape de sandbox (RCE), manejo de ficheros en webhooks y formularios, fallos en flujos OAuth y de autenticación, SSRF o fuga de credenciales en nodos HTTP, y nodos de terceros maliciosos. Cada tipo corresponde a una capa: parcheo, aislamiento, control de nodos, autenticación y egress.
- [HIPÓTESIS] Con unos 240 avisos y lotes mensuales, una oferta de "gestión de parches/versiones n8n" tiene una justificación sólida.

### Gaps
- No obtuve los CVSS ni las fechas exactas de NVD de los CVE del lote de febrero, ni los de CVE-2026-27577/27493/72767/21877.
- No revisé las páginas 2 a 24 del listado GHSA. El total de unos 240 es una estimación a partir de la paginación (10 por página).

## 2. Hardening oficial de n8n self-hosted

### Takeaway
La documentación de n8n ofrece bastantes controles: auditoría, SSL, SSO SAML/OIDC, MFA forzada, rotación de la clave de cifrado, task runners endurecidos, protección SSRF, bloqueo de nodos, desactivación de la API pública y redacción de datos de ejecución. Varios valores por defecto son permisivos.

### Cited Findings
- Secciones oficiales: gestión de políticas (enforcement de MFA), auditorías de seguridad, SSL, SSO (SAML u OIDC), rotación de claves de cifrado, descifrado de tokens OAuth con JWE, hardening de task runners, redacción de datos de ejecución, desactivación de la API pública, bloqueo de nodos, protección SSRF y verificación de emails. [VERIFICADO; la página dice "actualizada hace 6 días"] — [n8n Docs Security](https://docs.n8n.io/deploy/host-n8n/configure-n8n/security)
- Variables de entorno y sus valores por defecto. [VERIFICADO] — [n8n Docs: env vars de seguridad](https://docs.n8n.io/deploy/host-n8n/configure-n8n/basic-configuration/use-environment-variables/security)

  | Variable | Por defecto | Qué controla |
  |-|-|-|
  | `N8N_BLOCK_ENV_ACCESS_IN_NODE` | `false` | Si es false, expresiones y nodo Code pueden leer variables de entorno |
  | `N8N_BLOCK_FILE_ACCESS_TO_N8N_FILES` | `true` | Bloquea el acceso al directorio `.n8n` |
  | `N8N_RESTRICT_FILE_ACCESS_TO` | (vacío) | Directorios a los que se limita el acceso a ficheros |
  | `N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS` | `false` | Fuerza permisos 0600 en el fichero de settings |
  | `N8N_SECURE_COOKIE` | `true` | Cookies solo por HTTPS |
  | `N8N_SAMESITE_COOKIE` | `lax` | Política SameSite de las cookies |
  | `N8N_CONTENT_SECURITY_POLICY` | Incluye `'unsafe-eval'` | CSP de las páginas de n8n |
  | `N8N_GIT_NODE_DISABLE_BARE_REPOS` | `false` | Uso de repos bare en el nodo Git |
  | `N8N_GIT_NODE_ENABLE_HOOKS` | `false` | Ejecución de hooks Git |
  | `N8N_POSTMESSAGE_ALLOWED_ORIGINS` | (vacío) | Si está vacío, el editor acepta mensajes de cualquier origen |
  | `N8N_MFA_ENFORCED_ENABLED` | `false` | MFA obligatoria para todos |
  | `N8N_SECURITY_POLICY_MANAGED_BY_ENV` | `false` | Gestionar la política desde env vars |

- Hardening de task runners (aislamiento del nodo Code): modo externo en contenedor separado, imagen distroless, usuario `nobody`, root filesystem de solo lectura con `emptyDir` y perfil AppArmor. [VERIFICADO] — [n8n Docs Harden task runners](https://docs.n8n.io/deploy/host-n8n/configure-n8n/security/harden-task-runners)
- Autenticación del nodo Webhook:
  - Métodos: Basic, Header, JWT, n8n User Auth y None. La opción IP Allowlist devuelve 403 fuera de la lista y, si se deja vacía, admite cualquier IP.
  - El payload máximo es 16 MB (`N8N_PAYLOAD_SIZE_MAX`).
  - La página no menciona verificación HMAC ni rate limiting.
  - [VERIFICADO] — [n8n Docs Webhook node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook)
- Recomendación de terceros: contenedores con privilegios mínimos, FS de solo lectura y usuario no root. [VERIFICADO] — [Endor Labs](https://www.endorlabs.com/learn/cve-2026-25049-n8n-rce)

### Inferences
- [HIPÓTESIS] Lo que más aporta un servicio de hardening: activar `N8N_BLOCK_ENV_ACCESS_IN_NODE=true`, MFA forzada, task runners externos, allowlist SSRF, bloquear los nodos Code/Execute Command si no se usan, desactivar la API pública y sacar la UI del acceso a Internet (VPN o Zero Trust) dejando solo los paths `/webhook/` públicos.
- [HIPÓTESIS] Para la clave de cifrado (`N8N_ENCRYPTION_KEY`) los riesgos son su exposición vía variables de entorno o vía lectura de ficheros (justo el impacto de CVE-2026-21858). Rotarla tiene procedimiento oficial.

### Gaps
- No leí las páginas de detalle de SSRF protection, ni de rotación de claves y su variable concreta, ni de user management.
- No comparé las diferencias de funcionalidad entre la edición Community y la Enterprise (SSO y otras).

## 3. Exposición de n8n en Internet

### Takeaway
Hay decenas o cientos de miles de instancias n8n accesibles desde Internet. Las cifras varían mucho según la metodología.

### Cited Findings
- Shadowserver, 9-ene-2026: 105.753 IPs únicas vulnerables a CVE-2026-21858 sobre 230.562 IPs con n8n. [ESTIMACIÓN; visto en el snippet del post de X] — [Shadowserver en X](https://x.com/Shadowserver/status/2010082651450044532)
- Censys, advisory del 7-ene-2026: 26.512 hosts expuestos con versión <1.121.0. [ESTIMACIÓN] — [Censys](https://censys.com/advisory/cve-2026-21858/)
- Wiz agrega "59.000–100.000" instancias potencialmente vulnerables, citando a BleepingComputer y Cyera. [NO VERIFICADO; agregador] — [Wiz](https://www.wiz.io/vulnerability-database/cve/cve-2026-21858)
- Más de 24.700 instancias seguían sin parchear a principios de feb-2026 (datos de Shadowserver). [ESTIMACIÓN] — [CSA](https://labs.cloudsecurityalliance.org/research/csa-research-note-n8n-rce-ai-pipeline-attack-surface-2026031/)
- GreyNoise documentó escaneo de endpoints de webhook n8n desde clusters Kubernetes (3-feb-2026). Wiz menciona IoC vinculados a Zerobot y MuddyWater. [NO VERIFICADO; referenciado vía Wiz] — [Wiz](https://www.wiz.io/vulnerability-database/cve/cve-2026-21858)
- Contradicción: 26.5k (Censys) frente a 105k (Shadowserver) en la misma semana. Lo más probable es que se deba a cómo cada uno detecta instancias (por IP o por host, fingerprinting de versión). [HIPÓTESIS]

### Inferences
- [HIPÓTESIS] El escaneo masivo de `/webhook/` y `/form/` justifica una capa de inventario y monitorización de la superficie expuesta (EASM).

### Gaps
- No encontré conteos de Shodan ni cifras posteriores a marzo de 2026.

## 4. Buenas prácticas de seguridad en webhooks (y comparación Make/Zapier)

### Takeaway
La referencia del sector es: HTTPS, firma HMAC del cuerpo, timestamp con tolerancia contra replay, deduplicación por ID de evento (idempotencia) y allowlist de IPs como complemento. Los webhooks genéricos de n8n, Make y Zapier no verifican firmas de forma nativa, así que esa verificación la tiene que implementar el usuario.

### Cited Findings
- Stripe:
  - Firma cada evento en la cabecera `Stripe-Signature`.
  - Sus librerías aplican por defecto una tolerancia de 5 minutos al timestamp (protección contra replay) y piden sincronizar el reloj con NTP.
  - Publica una lista de IPs de envío para allowlisting.
  - Exige HTTPS en live mode, solo con TLS 1.2 y 1.3.
  - Pueden llegar eventos duplicados, que se deduplican registrando los IDs de evento.
  - [VERIFICADO] — [Stripe Docs Webhooks](https://docs.stripe.com/webhooks)
- GitHub: valida las entregas con un secreto de webhook (cabecera X-Hub-Signature-256, HMAC-SHA256, y comparación en tiempo constante según la doc conocida). [VERIFICADO solo el título y descripción de la página; los detalles de la cabecera y la comparación en tiempo constante, NO VERIFICADO en esta extracción] — [GitHub Docs](https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries)
- Make, Zapier, n8n e IFTTT: sus triggers de webhook genéricos aceptan cualquier petición sin verificación criptográfica nativa de firma. [NO VERIFICADO; afirmación de un blog de vendedor] — [codehooks.io](https://codehooks.io/blog/secure-zapier-make-n8n-webhooks-signature-verification)
- Zapier: algunos servicios requieren allowlistear las IPs de Zapier, y la autenticación avanzada se configura en la Developer Platform. [VERIFICADO, snippet] — [Zapier Help](https://help.zapier.com/hc/en-us/articles/8496215655437-Zap-is-not-receiving-webhooks)
- Un caso real de los avisos de n8n: una petición sin autenticar podía resetear el secreto de verificación del Asana Trigger. Una implementación de firma defectuosa anula esta capa. [VERIFICADO] — [GHSA-mx4r-96jx-v278](https://github.com/n8n-io/n8n/security/advisories)

### Inferences
- [HIPÓTESIS] Capa propuesta: un gateway o worker delante del webhook (por ejemplo Cloudflare Worker o un API gateway) que verifique HMAC y timestamp, deduplique, aplique rate limiting y allowlist de IP, y solo entonces reenvíe a n8n con un header secreto. Límite: no protege si el emisor está comprometido o el secreto se filtra. Tampoco sirve con emisores que no firman.
- [HIPÓTESIS] La allowlist de IP falla si el emisor usa nube compartida o cambia de IPs.

### Gaps
- No consulté la documentación de Shopify (X-Shopify-Hmac-Sha256), la OWASP Webhook/REST Security Cheat Sheet ni las docs oficiales de seguridad de Make.

## 5. OWASP API Security Top 10 (2023)

### Takeaway
Las 10 categorías oficiales [VERIFICADO] — [OWASP API Security Top 10 2023](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)

### Cited Findings
- API1 Broken Object Level Authorization: no se comprueba el acceso a cada objeto referenciado por ID.
- API2 Broken Authentication: autenticación mal implementada que permite comprometer tokens o suplantar identidades.
- API3 Broken Object Property Level Authorization: falta autorización a nivel de propiedad. Fusiona Excessive Data Exposure y Mass Assignment de 2019.
- API4 Unrestricted Resource Consumption: consumo de CPU, ancho de banda o servicios de pago (SMS, email) que acaba en DoS o en costes.
- API5 Broken Function Level Authorization: confusión entre funciones administrativas y normales que da acceso a funciones admin.
- API6 Unrestricted Access to Sensitive Business Flows: abuso automatizado de flujos de negocio (compras, comentarios) aunque no haya bug.
- API7 Server Side Request Forgery: la API obtiene recursos de URIs del usuario sin validarlas.
- API8 Security Misconfiguration: configuraciones complejas que se dejan inseguras.
- API9 Improper Inventory Management: inventario incompleto de hosts, versiones y endpoints de debug u obsoletos.
- API10 Unsafe Consumption of APIs: se confía más en APIs de terceros que en la entrada del usuario.

### Inferences
- [HIPÓTESIS] Encaje con n8n:
  - API7 (SSRF): nodos HTTP Request y la protección SSRF de n8n.
  - API10: datos de webhooks o APIs de terceros que entran en expresiones (CVE-2025-68613 y CVE-2026-25049).
  - API2: webhooks con autenticación "None".
  - API4 y API6: webhooks que disparan llamadas a LLM, SMS o email de pago sin rate limiting.
  - API9: webhooks olvidados (la auditoría de n8n marca workflows abandonados a los 90 días).

### Gaps
- Ninguno relevante.

## 6. Cloudflare Turnstile frente a WAF, rate limiting, bot management y API Shield

### Takeaway
Turnstile solo verifica que hay un humano en un navegador que ejecuta su widget (formularios, logins). No protege webhooks ni APIs máquina a máquina, porque ahí no hay navegador que resuelva el desafío. Para esos casos están WAF, rate limiting, bot management y API Shield (este último solo en Enterprise).

### Cited Findings
- Turnstile:
  - Es una alternativa a CAPTCHA que se incrusta sin necesidad de usar la CDN de Cloudflare.
  - Lanza desafíos JavaScript en el cliente para distinguir humanos de bots.
  - Tiene widgets managed, non-interactive e invisible, cumple WCAG 2.2 AA y tiene Pre-clearance para SPAs.
  - [VERIFICADO] — [Cloudflare Turnstile docs](https://developers.cloudflare.com/turnstile/)
- El token de Turnstile vale 300 segundos, es de un solo uso y debe validarse en servidor (siteverify) en cada petición: "Never trust client-side validation alone". [VERIFICADO] — [Turnstile server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- La página de validación no dice explícitamente que Turnstile no proteja APIs ni que deba combinarse con WAF. Es un resultado negativo. [VERIFICADO negativo] — misma fuente.
- API Shield:
  - Add-on de pago solo para Enterprise.
  - Ofrece descubrimiento de APIs, validación de esquemas OpenAPI (schema learning) y detección de abusos (credential stuffing, fuerza bruta).
  - [VERIFICADO, resumen de la página] — [Cloudflare API Shield](https://developers.cloudflare.com/api-shield/)

### Inferences
- [HIPÓTESIS] Límites de cada capa:
  - Turnstile no cubre APIs, webhooks, bots que resuelven el desafío con granjas humanas ni vulnerabilidades del backend.
  - El WAF bloquea patrones conocidos y virtual patching, pero no fallos de lógica o autorización (BOLA).
  - El rate limiting frena la fuerza bruta y el consumo de recursos (API4), pero no ataques lentos ni distribuidos.
  - Bot management se basa en puntuación y requiere plan de pago.
  - API Shield (mTLS, esquema, JWT) es el más adecuado para APIs, pero es solo Enterprise.
  - Ninguno sustituye al parcheo de n8n: CVE-2026-21858 llega por un endpoint de formulario o webhook legítimo.

### Gaps
- No leí las páginas de Cloudflare WAF, Rate Limiting Rules ni Bot Management (planes, límites), ni la página de mTLS/JWT de API Shield. No se recogen precios.
