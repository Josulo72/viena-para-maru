# Capa de protección de agentes IA / integraciones LLM en automatizaciones (n8n, MCP, agentes con tools sobre CRM/ERP/email)

Fecha de acceso de todas las fuentes: 2026-11-05. Etiquetas de confianza: [VERIFICADO] = leído en fuente primaria o snippet de fuente primaria; [ESTIMACIÓN]; [HIPÓTESIS]; [NO VERIFICADO].

## 1. OWASP Top 10 for LLM Applications (versión 2025)

### Takeaway
La versión vigente localizada es la 2025 (publicada nov. 2024). No se encontró una versión LLM "2026"; OWASP ha publicado en paralelo un Top 10 específico de aplicaciones agénticas (ver sección 2).

### Cited Findings
- Página oficial de la lista 2025 ("2025 Top 10 Risk & Mitigations for LLMs and Gen AI Apps") — [genai.owasp.org/llm-top-10](https://genai.owasp.org/llm-top-10/) ; PDF: [OWASP-Top-10-for-LLMs-v2025.pdf](https://owasp.github.io/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf). Pub. nov-2024. [VERIFICADO existencia; la lista de categorías siguiente se apoya en el PDF y en conocimiento previo coherente con los snippets (p.ej. LLM04:2025 Data and Model Poisoning y LLM08:2025 Vector and Embedding Weaknesses citados literalmente en el documento OWASP ASI, ver sección 2)]:
  - LLM01 Prompt Injection — entradas (directas o indirectas vía contenido externo) que alteran el comportamiento del modelo.
  - LLM02 Sensitive Information Disclosure — el modelo/app expone datos personales, secretos o datos de negocio.
  - LLM03 Supply Chain — modelos, datasets, plugins o dependencias de terceros comprometidos.
  - LLM04 Data and Model Poisoning — manipulación de datos de entrenamiento/fine-tuning/embeddings.
  - LLM05 Improper Output Handling — la salida del LLM se pasa sin validar a sistemas downstream (XSS, SQLi, ejecución).
  - LLM06 Excessive Agency — el agente tiene demasiadas funciones, permisos o autonomía.
  - LLM07 System Prompt Leakage — exposición del prompt de sistema y de lo que se haya metido en él (credenciales, reglas).
  - LLM08 Vector and Embedding Weaknesses — debilidades en RAG/vector stores (fugas entre tenants, inyección vía documentos).
  - LLM09 Misinformation — salidas falsas/alucinaciones tomadas como ciertas.
  - LLM10 Unbounded Consumption — consumo sin límite (coste, DoS, extracción de modelo).

### Inferences
- Para una pyme con n8n, los más relevantes en la práctica son LLM01, LLM02, LLM05 y LLM06 (agente con credenciales CRM/email que ejecuta acciones). [HIPÓTESIS razonada]

### Gaps
- No se verificó si OWASP ha publicado una revisión del Top 10 LLM posterior a 2025 a fecha nov-2026 (la búsqueda solo devolvió la 2025).

## 2. OWASP Agentic Security Initiative (ASI): Threats & Mitigations y Top 10 Agentic 2026

### Takeaway
Dos documentos clave: "Agentic AI – Threats and Mitigations" (v1.0, 17-feb-2025, taxonomía T1–T15) y el "OWASP Top 10 for Agentic Applications for 2026" (anunciado 9-dic-2025, ASI01–ASI10). Además existe un OWASP MCP Top 10.

### Cited Findings
- "Agentic AI – Threats and Mitigations", fechado 17-feb-2025, primer documento de la serie del OWASP Agentic Security Initiative, referencia basada en modelo de amenazas — [genai.owasp.org](https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/) [VERIFICADO]
- El documento v1.0.1 define T1 Memory Poisoning (envenenar memoria corta/larga del agente; mitigación: validación de contenido de memoria, aislamiento de sesión, autenticación de acceso a memoria, detección de anomalías, snapshots/rollback) y T2 Tool Misuse; incluye playbooks como "Securing AI Tool Execution & Preventing Unauthorized Actions" (cubre Tool Misuse, Privilege Compromise, Unexpected RCE & Code Attacks, Resource Overload) y "Preventing Memory Poisoning" (cubre Memory Poisoning, Cascading Hallucination Attacks) — [PDF en HAL](https://hal.science/hal-04985337v1/file/Agentic-AI-Threats-and-Mitigations_v1.0.1.pdf) [VERIFICADO]
- Mitigaciones explícitas del playbook de tools: registrar todas las interacciones con trazabilidad forense; detectar encadenamiento de comandos que evade políticas; **aprobación explícita del usuario para ejecuciones en funciones financieras, médicas o administrativas**; verificación humana antes de ejecutar código generado con privilegios; detectar frecuencia anómala de invocación — [mismo PDF](https://hal.science/hal-04985337v1/file/Agentic-AI-Threats-and-Mitigations_v1.0.1.pdf) [VERIFICADO]
- El documento advierte de agentes con "overly broad API scopes" y de que pueden "chain multiple tools in unexpected ways"; recomienda reducir (down-scope) privilegios cuando el agente actúa en nombre del usuario — [mismo PDF] [VERIFICADO]
- Resto de la lista T1–T15 (Privilege Compromise, Resource Overload, Cascading Hallucination, Intent Breaking & Goal Manipulation, Misaligned & Deceptive Behaviors, Repudiation & Untraceability, Identity Spoofing, Overwhelming HITL, Unexpected RCE, Agent Communication Poisoning, Rogue Agents, Human Attacks on Multi-Agent Systems, Human Manipulation) — [NO VERIFICADO literalmente en esta sesión; procede de conocimiento previo; parte de los nombres sí aparecen en los playbooks citados arriba]
- OWASP Top 10 for Agentic Applications 2026 — [genai.owasp.org recurso](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/); anuncio 9-dic-2025 — [blog OWASP](https://genai.owasp.org/2025/12/09/owasp-top-10-for-agentic-applications-the-benchmark-for-agentic-security-in-the-age-of-autonomous-ai/) [VERIFICADO]. Lista (confirmada en fuentes secundarias coincidentes: [DeepTeam](https://www.trydeepteam.com/docs/frameworks-owasp-top-10-for-agentic-applications), [Auth0](https://auth0.com/blog/owasp-top-10-agentic-applications-lessons/), [SecureW2](https://securew2.com/blog/owasp-top-10-agentic-ai)) [VERIFICADO por triangulación]:
  - ASI01 Agent Goal Hijack — inyección directa/indirecta redirige objetivos o planes del agente.
  - ASI02 Tool Misuse & Exploitation — uso indebido de herramientas legítimas dentro de los permisos concedidos.
  - ASI03 Agent Identity & Privilege Abuse — credenciales/identidad del agente usadas más allá de su alcance.
  - ASI04 Agentic Supply Chain Compromise — tools, servidores MCP, plugins, modelos de terceros comprometidos.
  - ASI05 Unexpected Code Execution — el agente genera/ejecuta código o comandos no previstos.
  - ASI06 Memory & Context Poisoning — memoria persistente/RAG/contexto envenenado.
  - ASI07 Insecure Inter-Agent Communication — mensajes entre agentes sin autenticación/integridad.
  - ASI08 Cascading Agent Failures — un fallo se propaga por cadenas de agentes/workflows.
  - ASI09 Human-Agent Trust Exploitation — el agente (manipulado) engaña al humano que aprueba.
  - ASI10 Rogue Agents — agentes que derivan de su alcance o persiguen objetivos ocultos.
- Ejemplos reales que OWASP asocia: EchoLeak (CVE-2025-32711, Microsoft 365 Copilot, CVSS 9.3, sin evidencia de explotación) para ASI01; Amazon Q Developer (CVE-2025-8217, token de GitHub sobredimensionado permitió insertar un prompt destructivo en la extensión de VS Code, jul-2025, sin impacto en clientes según AWS) para ASI02 — [Witness AI blog](https://witness.ai/blog/owasp-agentic-ai-threats-and-mitigations/), con enlaces a [NVD](https://nvd.nist.gov/vuln/detail/cve-2025-32711) y [AWS-2025-015](https://aws.amazon.com/security/security-bulletins/AWS-2025-015/) [VERIFICADO vía secundaria con enlaces primarios]
- OWASP mantiene además un MCP Top 10 (tool poisoning, supply chain tampering, command injection, shadow servers) — [owasp.org/projects/mcp-top-10](https://owasp.org/projects/mcp-top-10) (citado por Witness AI) [NO VERIFICADO directamente]

### Inferences
- ASI02/ASI03 son el núcleo para pymes: el daño lo hace un agente con permisos reales actuando "legítimamente". Control principal = mínimo privilegio + aprobación humana para acciones de alto impacto (envío masivo, pagos, borrados). [HIPÓTESIS razonada]

### Gaps
- No se leyó el PDF completo del Top 10 Agentic 2026; las descripciones de una línea son síntesis.

## 3. Riesgos MCP y guía oficial de la especificación

### Takeaway
La spec MCP incluye una guía oficial de "Security Best Practices" (versiones 2025-11-25 y 2026-07-28) centrada en autorización: confused deputy, token passthrough (prohibido), minimización de scopes. Tool poisoning es un riesgo documentado por investigadores, no resuelto por el protocolo.

### Cited Findings
- Existe documentación de buenas prácticas versionada: [2026-07-28](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) y [2025-11-25](https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices). Secciones: Confused Deputy Problem (los proxies MCP **MUST** implementar mitigaciones de consentimiento por cliente), Token Passthrough, Scope Minimization [VERIFICADO]
- "Token passthrough" = el servidor MCP acepta tokens no emitidos para él y los reenvía al API downstream; está "explicitly forbidden in the authorization specification"; riesgos: elusión de controles (rate limiting, validación, monitorización) y confused deputy — [MCP best practices 2026-07-28](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) [VERIFICADO]
- Spec de autorización: clientes MUST incluir parámetro `resource`; servidores MUST validar que los tokens fueron emitidos para ellos; almacenamiento seguro de tokens (OAuth 2.1 §7.1); servidores de autorización SHOULD emitir tokens de corta vida y MUST rotar refresh tokens para clientes públicos; HTTPS obligatorio; PKCE obligatorio con S256 — [Authorization Security Considerations (draft)](https://modelcontextprotocol.io/specification/draft/basic/authorization/security-considerations) [VERIFICADO]
- Tool Poisoning Attacks: instrucciones maliciosas ocultas en descripciones de herramientas MCP; Invariant Labs afirmó que proveedores como Anthropic, OpenAI, Zapier y clientes como Cursor eran susceptibles — [Invariant Labs](https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks) (abr-2025) [VERIFICADO como afirmación del investigador]
- Demostración WhatsApp MCP: un servidor MCP malicioso "sleeper" anuncia una herramienta inocua y tras la aprobación la cambia ("rug pull"), sombreando el comportamiento de un servidor legítimo; exfiltra historial vía el propio WhatsApp sin que el agente interactúe directamente con el servidor malicioso. Segunda variante: basta con enviar un mensaje con instrucciones inyectadas que el agente lee al listar chats — [Invariant Labs](https://invariantlabs.ai/blog/whatsapp-mcp-exploited) [VERIFICADO]. CSA lo resume: la descripción envenenada parecía benigna en las interfaces de revisión probadas — [CSA research note](https://labs.cloudsecurityalliance.org/research/csa-research-note-mcp-tool-poisoning-ai-agent-exfiltration-2/) [VERIFICADO]
- Invariant Labs fue adquirida por Snyk — [blog Invariant](https://invariantlabs.ai/blog) [VERIFICADO titular]

### Inferences
- Implicación pyme: cualquier fuente de texto entrante (email, formulario web, ticket, mensaje de WhatsApp) que lea un agente con tools de envío es un vector; mezclar en un mismo agente un servidor MCP no confiable con uno que accede a datos sensibles es el patrón de riesgo. Controles: lista blanca de servidores MCP, fijar versiones/hash de definiciones de tools, credenciales por servidor con scope mínimo, no reutilizar tokens. [HIPÓTESIS razonada]

### Gaps
- No se encontraron cifras fiables del número de servidores MCP maliciosos en registros públicos.

## 4. ¿Es la prompt injection solucionable? Posición de vendors y organismos

### Takeaway
Consenso explícito: no existe solución completa. OpenAI y el NCSC británico dicen que probablemente nunca se resolverá del todo; Anthropic publica tasas de éxito de ataque residuales (~1%) que califica de "riesgo significativo". La estrategia aceptada es contención (diseño, privilegios, HITL), no filtrado.

### Cited Findings
- OpenAI (22-dic-2025): "Prompt injection, much like scams and social engineering on the web, is unlikely to ever be fully 'solved'"; apuesta por red teaming automatizado, RL y respuesta rápida — [OpenAI, Hardening Atlas](https://openai.com/index/hardening-atlas-against-prompt-injection/) vía [Fortune 23-dic-2025](https://fortune.com/2025/12/23/openai-ai-browser-prompt-injections-cybersecurity-hackers/) [VERIFICADO vía cita literal en prensa]
- OpenAI lanzó "Lockdown Mode" y etiquetas "Elevated Risk" en ChatGPT (13-feb-2026) — [OpenAI](https://openai.com/index/introducing-lockdown-mode-and-elevated-risk-labels-in-chatgpt/) vía [Vectra](https://www.vectra.ai/topics/prompt-injection) [VERIFICADO vía secundaria]
- UK NCSC (8-dic-2025, Dave Chismon): "Current large language models (LLMs) simply do not enforce a security boundary between instructions and data inside a prompt"; compararla con SQL injection es peligroso porque socava las mitigaciones — [NCSC](https://www.ncsc.gov.uk/blog-post/prompt-injection-is-not-sql-injection) [VERIFICADO]. Que el NCSC diga que "puede que nunca se mitigue totalmente" aparece en resúmenes secundarios ([Group-IB en X](https://x.com/GroupIB/status/2109630161754984652)) [VERIFICADO como paráfrasis secundaria]
- Anthropic (nov-2025): con salvaguardas mejoradas, tasa de éxito de un atacante Best-of-N en Claude for Chrome: Opus 4.5 1,4%, Sonnet 4.5 1,9%, Haiku 4.5 2,4% (sin salvaguardas 8–14%); "A 1% attack success rate—while a significant improvement—still represents meaningful risk" — [Anthropic research](https://www.anthropic.com/research/prompt-injection-defenses) [VERIFICADO]
- WorkOS cita datos de Anthropic donde un mismo modelo tiene 0% de ASR en un entorno y 78,6% en otro: el riesgo depende de la superficie, no solo del modelo — [WorkOS](https://workos.com/blog/ai-agent-governance-prompt-injection-surface-not-model) [ESTIMACIÓN; secundaria, no contrastada con la system card]
- NIST AI 100-2 E2025 (mar-2025): define prompt injection como ataque que "exploits the concatenation of untrusted input with a prompt constructed by a higher-trust party"; la indirecta se ejecuta mediante "resource control" por un tercero y puede secuestrar agentes para tareas maliciosas o exfiltrar datos privados del usuario — [NIST PDF](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-2e2025.pdf), [CSRC](https://csrc.nist.gov/pubs/ai/100/2/e2025/final) [VERIFICADO]
- NIST blog sobre evaluación de "agent hijacking" (ene-2025) la define como inyección indirecta — [NIST](https://www.nist.gov/news-events/news/2025/01/technical-blog-strengthening-ai-agent-hijacking-evaluations) (citado por Witness AI) [NO VERIFICADO directamente]

### Inferences
- Límites de guardrails: los clasificadores de jailbreak/injection son probabilísticos (umbral de confianza; ver n8n abajo) y un atacante adaptativo con múltiples intentos los supera con tasa no nula. Deben tratarse como capa de detección, no de prevención. [HIPÓTESIS bien fundada en las cifras de Anthropic y la postura NCSC]
- Lo técnicamente mitigable con garantías: privilegios/scopes, separación de agentes que leen contenido no confiable de los que actúan, aprobación humana, allowlists de destinatarios/dominios, límites de gasto, logging. Lo no mitigable con garantías: que el modelo distinga instrucción de dato. [HIPÓTESIS razonada]

### Gaps
- No se localizaron en esta sesión declaraciones primarias de Google (p.ej. defensa en capas de Gemini) ni de Microsoft (Prompt Shields/Spotlighting) — [NO VERIFICADO]; requiere búsqueda adicional.
- UK AISI: no se encontró publicación específica en esta sesión.

## 5. Tooling comercial y categorías

### Takeaway
Categorías: (a) guardrails/"LLM firewalls" runtime (filtro de entrada/salida, detección de injection, PII), (b) plataformas de seguridad IA / AI-SPM (inventario, postura, red teaming), (c) gateways/gobierno MCP. Consolidación fuerte: los especialistas han sido absorbidos por grandes de ciberseguridad.

### Cited Findings
- Check Point anunció acuerdo para adquirir Lakera (plataforma de seguridad IA para aplicaciones agénticas) — [Check Point PR](https://www.checkpoint.com/press-releases/check-point-acquires-lakera-to-deliver-end-to-end-ai-security-for-enterprises/) (sept-2025 aprox., fecha exacta no leída) [VERIFICADO]
- Palo Alto Networks completó la compra de Protect AI el 22-jul-2025; se integra en Prisma AIRS — [Palo Alto PR](https://www.paloaltonetworks.com/company/press/2025/palo-alto-networks-completes-acquisition-of-protect-ai) [VERIFICADO]
- Snyk adquirió Invariant Labs (Invariant Guardrails, enfocado en agentes y MCP) — [Invariant blog](https://invariantlabs.ai/blog) [VERIFICADO titular]
- WitnessAI ofrece control de servidores MCP aprobados y bloqueo de tool calls no autorizadas — [Witness AI](https://witness.ai/blog/owasp-agentic-ai-threats-and-mitigations/) [VERIFICADO como afirmación del vendor]
- Herramienta de red teaming open source alineada con OWASP: DeepTeam — [trydeepteam.com](https://www.trydeepteam.com/docs/frameworks-owasp-top-10-for-agentic-applications) [VERIFICADO]
- **n8n incluye un nodo Guardrails** nativo: operación "Sanitize Text" (detecta URLs, regex, claves secretas, PII como teléfonos y tarjetas, y las sustituye por placeholders) y chequeos como Jailbreak (con umbral de confianza 0.0–1.0 y prompt personalizable, es decir, basado en un modelo), PII (entidades seleccionables: CREDIT_CARD, EMAIL_ADDRESS, PHONE_NUMBER, US_SSN…) — [n8n docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-langchain.guardrails) [VERIFICADO]
- Precios: no se buscaron/no públicos — no se incluyen.

### Inferences
- Para pymes españolas, el producto enterprise (Prisma AIRS, Check Point/Lakera) probablemente es sobredimensionado; el nivel realista es el nodo Guardrails de n8n + diseño de permisos + revisión humana. [HIPÓTESIS]
- Las entidades PII del nodo n8n incluyen tipos centrados en EE. UU. (US_SSN); no se verificó soporte de DNI/NIE/IBAN español. [HIPÓTESIS / gap]

### Gaps
- No se verificaron otros vendors citados habitualmente (Prompt Security/SentinelOne, HiddenLayer, Lasso, Cisco AI Defense/Robust Intelligence, Microsoft Prompt Shields, Google Model Armor) — [NO VERIFICADO], no incluir sin comprobar.

## 6. Fuga de datos / RGPD al enviar datos de CRM a APIs de LLM

### Takeaway
La referencia europea más directa es el informe del programa Support Pool of Experts del EDPB "AI Privacy Risks & Mitigations – LLMs" (10-abr-2025), con metodología de riesgo y casos de uso (chatbot de atención al cliente, asistente de agenda). No es posición oficial del EDPB.

### Cited Findings
- Informe "AI Privacy Risks & Mitigations Large Language Models (LLMs)", 10-abr-2025; "This document was not produced by the EDPB" (contratistas externos, SPE); propone metodología de gestión de riesgos y casos de uso: chatbot de consultas de clientes, asistente de viajes/agenda — [EDPB](https://www.edpb.europa.eu/documents/support-pool-of-experts/ai-privacy-risks-mitigations-large-language-models-llms_en), [PDF](https://www.edpb.europa.eu/system/files/documents/2025-04/ai-privacy-risks-and-mitigations-in-llms.pdf) [VERIFICADO]
- El informe analiza flujos de datos en sistemas LLM, roles bajo AI Act y RGPD, y repetidamente indica que "Deployers should verify that the provider has effectively addressed this risk"; recomienda limitar el tratamiento a fines específicos (art. 5(1)(c)) — [PDF EDPB](https://www.edpb.europa.eu/system/files/documents/2025-04/ai-privacy-risks-and-mitigations-in-llms.pdf) [VERIFICADO]
- Documentos EDPB relacionados: Opinión 28/2024 sobre modelos de IA (17-dic-2024), Informe del ChatGPT Taskforce (2024), y Guidelines 03/2026 sobre web scraping en IA generativa (08-jul-2026) — [EDPB](https://www.edpb.europa.eu/documents/support-pool-of-experts/ai-privacy-risks-mitigations-large-language-models-llms_en) [VERIFICADO como listados]
- Precedentes sancionadores citados en el informe: Garante italiano multó a OpenAI con 15 M€ (2024) y bloqueó DeepSeek (2025) — [PDF EDPB, notas 206 y 260](https://www.edpb.europa.eu/system/files/documents/2025-04/ai-privacy-risks-and-mitigations-in-llms.pdf) [VERIFICADO]

### Inferences
- Para una pyme que envía datos de CRM a OpenAI/Anthropic/Google vía n8n: el proveedor LLM actúa normalmente como encargado (necesita DPA/art. 28), hay transferencia internacional si procesa fuera del EEE (cláusulas tipo / DPF), y aplica minimización (no enviar campos innecesarios; pseudonimizar con el nodo Guardrails antes de la llamada). Puede requerir EIPD si hay tratamiento a gran escala o decisiones automatizadas. [HIPÓTESIS basada en RGPD general, no en guía específica verificada]

### Gaps
- AEPD: no se buscó/no se localizó en esta sesión guía específica sobre agentes o APIs de LLM (la AEPD tiene publicaciones generales sobre IA y RGPD) — [NO VERIFICADO]; búsqueda pendiente.
- No se verificaron condiciones contractuales actuales (retención, entrenamiento, residencia de datos UE) de los APIs de OpenAI/Anthropic/Google.
