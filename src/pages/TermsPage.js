import React from 'react';
import { Link } from 'react-router-dom';
import LegalDocumentLayout, { LegalSection } from '../components/LegalDocumentLayout';

const SubHeading = ({ children }) => (
  <p className="font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold/80 mt-6 first:mt-0 mb-1">
    {children}
  </p>
);

const TermsPage = () => (
  <LegalDocumentLayout title="Términos y Condiciones" lastUpdated="agosto 2026">

    <LegalSection number={1} title="Aceptación de los Términos">
      <p>
        El presente documento (en adelante, los "Términos y Condiciones") regula el acceso y uso
        de la plataforma digital OURO (en adelante, "OURO", "la Plataforma", "nosotros"), operada
        por Lucila Ferullo, en su carácter de persona física, C.U.I.T. N.º 27-31631354-5, con
        domicilio en Ruta 40 Km 2226, San Martín de los Andes, Provincia del Neuquén, CP 8370,
        República Argentina.
      </p>
      <p>
        El acceso, registro o uso de la Plataforma, bajo cualquier modalidad, implica la lectura,
        comprensión y aceptación plena e irrevocable de estos Términos y Condiciones, de la{' '}
        <Link
          to="/privacidad"
          className="text-gold hover:text-gold-bright transition-colors duration-300 underline underline-offset-2"
        >
          Política de Privacidad
        </Link>
        , de la Política de Cancelación de Sesiones y de todo otro documento que se incorpore por
        referencia. Quien no acepte estos términos en su totalidad deberá abstenerse de utilizar
        la Plataforma.
      </p>
      <p>
        Estos Términos aplican a todos los usuarios de OURO, distinguiendo dos categorías con
        derechos y obligaciones diferenciadas: (i) los Profesionales que ofrecen sus servicios a
        través de la Plataforma, y (ii) los Consultantes que acceden a dichos servicios. Cada
        categoría se define en la Sección 2.
      </p>
    </LegalSection>

    <LegalSection number={2} title="Definiciones">
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong className="text-white font-medium">OURO / la Plataforma:</strong> el sitio web,
          aplicación y demás medios digitales operados por la empresa, a través de los cuales se
          facilita el contacto entre Profesionales y Consultantes.
        </li>
        <li>
          <strong className="text-white font-medium">Profesional:</strong> persona física
          independiente, mayor de edad, dedicada al bienestar, desarrollo personal, terapias
          integrativas o disciplinas afines, que se registra en OURO para ofrecer sesiones,
          talleres o contenidos.
        </li>
        <li>
          <strong className="text-white font-medium">Consultante:</strong> persona física que se
          registra en OURO para acceder a los servicios ofrecidos por los Profesionales.
        </li>
        <li>
          <strong className="text-white font-medium">Sesión:</strong> encuentro individual (uno a
          uno) entre un Profesional y un Consultante, coordinado a través de la Plataforma.
        </li>
        <li>
          <strong className="text-white font-medium">La Escuelita:</strong> sección de la
          Plataforma destinada a talleres, cursos y contenidos educativos o formativos elaborados
          por los Profesionales.
        </li>
        <li>
          <strong className="text-white font-medium">Pasarela de Pago / Procesador de Pagos:</strong>{' '}
          proveedor externo (Mercado Pago u otro que en el futuro lo reemplace) habilitado para el
          procesamiento de cobros y pagos dentro de la Plataforma.
        </li>
        <li>
          <strong className="text-white font-medium">Datos Personales y Datos Sensibles:</strong>{' '}
          tienen el alcance que les asigna la Ley N.º 25.326 de Protección de los Datos Personales
          y su normativa reglamentaria.
        </li>
      </ul>
    </LegalSection>

    <LegalSection number={3} title="Naturaleza de la Plataforma y Rol de OURO">
      <p>
        OURO es una plataforma tecnológica que actúa exclusivamente como espacio de encuentro,
        difusión y facilitación de acceso entre Profesionales independientes y Consultantes. OURO
        no es un prestador de servicios de salud, y no participa, dirige, supervisa clínicamente
        ni controla el contenido de las Sesiones individuales que se desarrollan entre el
        Profesional y el Consultante.
      </p>
      <p>
        En consecuencia, OURO no garantiza resultados, efectividad, idoneidad clínica ni
        adecuación de las Sesiones o de los Talleres a las necesidades particulares de cada
        Consultante. Toda decisión de iniciar, continuar o interrumpir un proceso terapéutico, de
        acompañamiento o formativo es de exclusiva responsabilidad del Consultante y del
        Profesional interviniente.
      </p>
    </LegalSection>

    <LegalSection number={4} title="Servicios que Brinda OURO">
      <p>
        OURO pone a disposición de los Profesionales y Consultantes las siguientes herramientas y
        servicios, de naturaleza estrictamente tecnológica, formativa y comunitaria:
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Infraestructura digital para la publicación de perfiles profesionales, agenda,
          coordinación y facturación de Sesiones. Esto último es meramente integrar la plataforma
          OURO con billeteras digitales oficiales que operan ellas mismas las cuestiones
          financieras de cada terapeuta; OURO no ejerce tal función.
        </li>
        <li>
          Espacio virtual ("La Escuelita") para la publicación de talleres, cursos y contenidos
          educativos elaborados por los Profesionales.
        </li>
        <li>
          Programas de mentoreo, capacitación continua y desarrollo profesional dirigidos a los
          Profesionales suscriptos como ofrecimiento interno para el staff de especialistas,
          siempre y cuando siga vigente la suscripción de cada quien.
        </li>
        <li>
          Un espacio de comunidad entre Profesionales, con el objeto de fomentar el intercambio de
          buenas prácticas dentro de la red OURO.
        </li>
      </ul>
      <p>
        Estos servicios constituyen el objeto contractual de OURO. Bajo ningún concepto implican
        la prestación directa de terapia, consulta médica, psicológica o de cualquier otra índole
        asistencial, las cuales son prestadas exclusivamente por cada Profesional en forma
        independiente.
      </p>
    </LegalSection>

    <LegalSection number={5} title="Profesionales Independientes: Rol, Obligaciones y Responsabilidades">
      <SubHeading>5.1 Naturaleza de la relación</SubHeading>
      <p>
        Los Profesionales que se suscriben a OURO actúan como prestadores de servicios
        independientes. No existe entre OURO y los Profesionales relación de dependencia laboral,
        sociedad, mandato, agencia ni representación de ningún tipo. Cada Profesional es
        responsable de su propia inscripción fiscal, aportes previsionales y cumplimiento de toda
        obligación derivada de su condición de trabajador autónomo o de la figura jurídica que
        corresponda.
      </p>

      <SubHeading>5.2 Idoneidad, habilitación y ejercicio profesional</SubHeading>
      <p>
        Cada Profesional declara y garantiza contar con formación, matrícula, habilitación o
        inscripción que la normativa vigente exija para el ejercicio de su actividad, en caso de
        tratarse de una profesión reglada (por ejemplo, Psicología conforme la Ley N.º 23.277 y
        las leyes provinciales de ejercicio profesional aplicables). Para actividades de bienestar
        o terapias integrativas no regladas por colegios o consejos profesionales, el Profesional
        declara actuar dentro del marco de sus competencias y sin atribuirse un alcance médico o
        clínico que no posee.
      </p>
      <p>
        OURO podrá solicitar documentación respaldatoria de la formación e idoneidad declarada por
        el Profesional, sin que ello implique una validación, aval, certificación ni garantía por
        parte de OURO respecto de la calidad, resultado o idoneidad de los servicios prestados por
        el Profesional.
      </p>

      <SubHeading>5.3 Responsabilidad exclusiva por el contenido de las Sesiones</SubHeading>
      <p>
        El Profesional es el único y exclusivo responsable por el contenido, desarrollo,
        metodología, recomendaciones, decisiones clínicas o de acompañamiento, y por cualquier
        consecuencia derivada de las Sesiones que brinde a través de la Plataforma. OURO no
        interviene ni supervisa el contenido de dichas Sesiones y no asume responsabilidad alguna
        por ellas.
      </p>

      <SubHeading>5.4 Deber de confidencialidad y secreto profesional</SubHeading>
      <p>
        El Profesional se obliga a mantener la confidencialidad de toda la información compartida
        por el Consultante durante las Sesiones, conforme al secreto profesional aplicable a su
        disciplina y a la normativa de protección de datos personales, respondiendo personalmente
        por su incumplimiento.
      </p>
    </LegalSection>

    <LegalSection number={6} title="Sesiones Individuales (Uno a Uno)">
      <p>
        Las Sesiones son coordinadas, desarrolladas y gestionadas exclusivamente entre el
        Profesional y el Consultante. OURO únicamente provee el medio tecnológico de agenda,
        comunicación y, en su caso, cobro de la Sesión, sin intervenir en su contenido.
      </p>
      <p>
        El vínculo que se genera en el marco de una Sesión es de exclusiva incumbencia entre el
        Profesional y el Consultante. OURO no es parte de dicho vínculo y no responde por sus
        resultados, por lo que cualquier reclamo derivado del contenido, desarrollo o consecuencias
        de una Sesión deberá dirigirse directamente al Profesional interviniente, sin perjuicio de
        lo señalado en la Sección 16.
      </p>
    </LegalSection>

    <LegalSection number={7} title='Talleres y Contenidos Educativos ("La Escuelita")'>
      <p>
        Los talleres, cursos y demás contenidos publicados en "La Escuelita" son creados y
        dictados por los terapeutas suscriptos en la plataforma y/o aprobados por OURO, quienes
        son sus autores y responsables exclusivos por la veracidad, legalidad y adecuación de su
        contenido.
      </p>
      <p>
        La revisión que OURO realiza con carácter previo a la publicación de un taller se limita,
        exclusivamente, al cumplimiento de los lineamientos de comunidad, formato, extensión y
        estándares editoriales de la Plataforma (por ejemplo: título, descripción, imágenes,
        duración, ausencia de lenguaje ofensivo o contenido manifiestamente ilegal). OURO no
        evalúa, corrige, valida ni se pronuncia sobre el contenido clínico, terapéutico, técnico o
        metodológico del taller, aspecto que permanece bajo la exclusiva competencia y
        responsabilidad del Profesional autor. OURO dejará constancia documentada del alcance
        formal de cada revisión efectuada, a fin de acreditar dicho límite en caso de controversia.
      </p>
      <p>
        Esta revisión editorial no constituye, bajo ninguna circunstancia, una validación, aval,
        certificación clínica, profesional ni garantía de exactitud, idoneidad o resultado del
        contenido revisado.
      </p>
    </LegalSection>

    <LegalSection number={8} title="Obligaciones de los Consultantes">
      <p>El Consultante se obliga a:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Proporcionar datos veraces, exactos y actualizados al registrarse y utilizar la Plataforma.</li>
        <li>
          Utilizar la Plataforma de manera respetuosa, lícita y conforme a su finalidad,
          absteniéndose de conductas abusivas, discriminatorias, difamatorias o de cualquier forma
          de maltrato hacia los Profesionales u otros usuarios.
        </li>
        <li>
          Comprender que las Sesiones y Talleres no constituyen atención médica de urgencia o
          emergencia. Ante una situación de riesgo para su vida, integridad física o salud mental,
          el Consultante debe acudir de inmediato a un servicio de emergencias médicas o línea de
          crisis disponible en su localidad, y no a través de la Plataforma.
        </li>
        <li>
          Ser mayor de edad conforme la legislación de su domicilio, o contar con la autorización
          de su representante legal cuando así lo exija la normativa aplicable.
        </li>
      </ul>
    </LegalSection>

    <LegalSection number={9} title="Registro de Cuenta">
      <p>
        El acceso a determinadas funcionalidades de OURO requiere la creación de una cuenta de
        usuario, mediante el suministro de datos personales exactos. El usuario es responsable de
        la confidencialidad de sus credenciales de acceso y de toda actividad realizada bajo su
        cuenta. OURO podrá suspender o dar de baja cuentas que incumplan estos Términos, conforme
        el procedimiento establecido en la Sección 18.
      </p>
    </LegalSection>

    <LegalSection number={10} title="Pagos y Servicios de Terceros — Procesamiento a través de Mercado Pago">
      <p>
        OURO no es una entidad financiera, no presta servicios de pago, no administra cuentas de
        dinero de terceros ni retiene fondos de Profesionales o Consultantes. El procesamiento de
        cobros y pagos dentro de la Plataforma es realizado íntegramente por Mercado Pago (o el
        proveedor de servicios de pago que en el futuro lo reemplace), entidad autorizada y
        regulada conforme a la normativa del Banco Central de la República Argentina (BCRA)
        aplicable a los Proveedores de Servicios de Pago.
      </p>
      <p>
        Al utilizar los medios de pago disponibles en la Plataforma, el usuario acepta
        adicionalmente los términos y condiciones y la política de privacidad del proveedor del
        servicio de pago, disponibles en su sitio oficial. OURO no tiene acceso, control ni
        responsabilidad sobre los datos de tarjetas, cuentas bancarias o billeteras virtuales del
        usuario, los cuales son gestionados exclusivamente por dicho proveedor.
      </p>
      <p>
        El valor de la sesión, taller y/o curso será dispuesto por el terapeuta suscripto. Los
        plazos de acreditación y condiciones de cobro podrán variar según el tipo de billetera
        virtual que se esté utilizando en la plataforma como método elegido. OURO dispone la
        integración, no las normativas y gestiones propias de la billetera que se elija.
      </p>
      <p>
        El pago de cualquier servicio dentro de la plataforma OURO será acreditado directamente a
        la cuenta del especialista que proporcione ese tipo de sesión y/o taller que el
        consultante esté interesado en comprar.
      </p>
    </LegalSection>

    <LegalSection number={11} title="Cancelaciones y Reembolsos">
      <p>
        Las cancelaciones y reprogramaciones son solicitadas por cada consultante y su terapeuta
        es quien definirá un nuevo espacio desde la plataforma, siempre y cuando así lo dicte su
        voluntad. El dinero no se reembolsa, solamente se puede volver a coordinar la compra (si
        es posible).
      </p>
    </LegalSection>

    <LegalSection number={12} title="Protección de Datos Personales">
      <SubHeading>12.1 Marco normativo</SubHeading>
      <p>
        OURO trata los datos personales de sus usuarios conforme a la Ley N.º 25.326 de Protección
        de los Datos Personales, su Decreto Reglamentario N.º 1558/2001 y las disposiciones de la
        Agencia de Acceso a la Información Pública (AAIP), autoridad de control en la materia.
      </p>

      <SubHeading>12.2 Datos sensibles vinculados a la salud</SubHeading>
      <p>
        En el marco del uso de la Plataforma pueden tratarse datos sensibles en los términos del
        artículo 2 de la Ley N.º 25.326 (por ejemplo, datos relativos a la salud física o mental
        del Consultante, en la medida en que sean suministrados por este al Profesional o a OURO).
        El tratamiento de datos sensibles requiere el consentimiento previo, expreso e informado
        del titular, el cual se recabará específicamente al momento del registro y, de
        corresponder, en cada instancia adicional en que resulte necesario.
      </p>

      <SubHeading>12.3 Finalidad y alcance del tratamiento por parte de OURO</SubHeading>
      <p>
        OURO no accede al contenido sustantivo de las Sesiones individuales entre Profesional y
        Consultante, las cuales se rigen por el deber de confidencialidad y secreto profesional
        descripto en la Sección 5.4. Los datos que OURO trata directamente se limitan a los
        necesarios para la gestión de la cuenta, la coordinación de Sesiones, la facturación y el
        cumplimiento de obligaciones legales.
      </p>

      <SubHeading>12.4 Derechos del titular de los datos</SubHeading>
      <p>
        El usuario podrá ejercer en todo momento sus derechos de acceso, rectificación,
        actualización, supresión y oposición (derechos ARCO) respecto de sus datos personales,
        dirigiendo su solicitud al correo electrónico{' '}
        <a
          href="mailto:ouro.contacto2026@gmail.com"
          className="text-gold hover:text-gold-bright transition-colors duration-300 underline underline-offset-2"
        >
          ouro.contacto2026@gmail.com
        </a>
        . Asimismo, se le informa que la AAIP, en su carácter de Órgano de Control, tiene la
        atribución de atender denuncias y reclamos que se interpongan con relación al
        incumplimiento de las normas sobre protección de datos personales.
      </p>

      <SubHeading>12.5 Transferencia de datos a terceros</SubHeading>
      <p>
        OURO podrá compartir datos personales con proveedores tecnológicos (hosting,
        almacenamiento en la nube, herramientas de videollamada) y con el Procesador de Pagos,
        únicamente en la medida necesaria para la prestación del servicio, exigiendo a dichos
        terceros niveles de protección adecuados y, cuando corresponda, mediante acuerdos de
        confidencialidad y encargo de tratamiento de datos.
      </p>
    </LegalSection>

    <LegalSection number={13} title="Propiedad Intelectual">
      <p>
        La denominación OURO (marca mixta) se encuentra registrada ante el Instituto Nacional de
        la Propiedad Industrial (INPI) de la República Argentina, mediante Resolución N.º
        3.889.289 (Acta N.º 4.701.500, presentada el 27/04/2026), a nombre de Lucila Ferullo
        (D.N.I. 31.631.354, C.U.I.T. 27-31631354-5), en la Clase 41, con protección limitada a
        "servicios de educación relacionados con el desarrollo espiritual". El registro se
        encuentra vigente hasta el 30/06/2036, fecha en la cual deberá gestionarse su renovación
        ante el mismo organismo.
      </p>
      <p>
        Todo el contenido de la Plataforma —diseño, software, textos, logotipos, bases de datos y
        demás elementos— es propiedad de OURO o de sus licenciantes, y se encuentra protegido por
        la normativa de propiedad intelectual e industrial vigente (Ley N.º 11.723 de Propiedad
        Intelectual y Ley N.º 22.362 de Marcas y Designaciones), quedando prohibida su
        reproducción, distribución o uso no autorizado.
      </p>
      <p>
        Los contenidos formativos (talleres, materiales de "La Escuelita") elaborados por los
        Profesionales son de autoría de estos últimos, quienes otorgan a OURO una licencia no
        exclusiva, revocable y limitada para su publicación, difusión y explotación dentro de la
        Plataforma, en los términos que se acuerden específicamente con cada Profesional.
      </p>
    </LegalSection>

    <LegalSection number={14} title="Infraestructura Tecnológica y Seguridad de la Información">
      <p>
        OURO implementa medidas técnicas y organizativas razonables para la protección de la
        información alojada en sus servidores, incluyendo medidas de ciberseguridad orientadas a
        prevenir accesos no autorizados, pérdida o alteración de datos, conforme a los estándares
        de la industria y a las exigencias mínimas de seguridad establecidas por la normativa de
        protección de datos personales aplicable.
      </p>
      <p>
        No obstante lo anterior, OURO no garantiza la inexistencia absoluta de fallas técnicas,
        interrupciones del servicio o incidentes de seguridad ajenos a su control razonable, y no
        será responsable por daños derivados de causas de fuerza mayor, caso fortuito, o de
        ataques informáticos que superen las medidas de seguridad razonablemente implementadas,
        sin perjuicio del deber de notificación de incidentes que corresponda conforme a la
        normativa vigente.
      </p>
    </LegalSection>

    <LegalSection number={15} title="Conducta Prohibida y Uso Indebido de la Plataforma">
      <p>Queda expresamente prohibido, sin que la enumeración sea taxativa:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Suplantar la identidad de terceros o proporcionar información falsa al registrarse.</li>
        <li>
          Utilizar la Plataforma con fines distintos a los previstos en estos Términos, incluyendo
          la captación de usuarios para contratar servicios por fuera de OURO eludiendo sus
          condiciones.
        </li>
        <li>
          Ejercer conductas abusivas, acosadoras, discriminatorias o de cualquier forma de
          maltrato hacia Profesionales, Consultantes o el equipo de OURO.
        </li>
        <li>
          Reproducir, copiar o explotar sin autorización los contenidos, marca o materiales de
          OURO o de los Profesionales.
        </li>
        <li>Intentar vulnerar la seguridad informática de la Plataforma.</li>
      </ul>
      <p>
        El incumplimiento de lo anterior habilitará a OURO a suspender o dar de baja la cuenta del
        usuario infractor, sin perjuicio de las acciones legales que correspondan.
      </p>
    </LegalSection>

    <LegalSection number={16} title="Limitación de Responsabilidad">
      <p>
        En la máxima medida permitida por la legislación aplicable, OURO no será responsable por:
        (i) el contenido, desarrollo o resultado de las Sesiones o Talleres brindados por los
        Profesionales; (ii) las decisiones adoptadas por los Consultantes en base a dichas
        Sesiones o Talleres; (iii) el incumplimiento por parte de un Profesional de sus
        obligaciones legales, fiscales o profesionales; (iv) fallas atribuibles a terceros
        proveedores, incluyendo el Procesador de Pagos; y (v) interrupciones del servicio
        derivadas de causas ajenas a su control razonable.
      </p>
      <p>
        Esta limitación de responsabilidad no alcanza a aquellos supuestos en los que, conforme a
        normas de orden público —en particular la Ley N.º 24.240 de Defensa del Consumidor y sus
        modificatorias—, la responsabilidad de OURO resulte indisponible por convención de partes.
        En tales casos, prevalecerá lo dispuesto por dicha normativa.
      </p>
    </LegalSection>

    <LegalSection number={17} title="Indemnidad">
      <p>
        El Profesional se obliga a mantener indemne a OURO, sus socios, directivos, empleados y
        colaboradores, frente a cualquier reclamo, denuncia, demanda judicial o extrajudicial,
        daño, pérdida o gasto (incluidos honorarios legales, costas y costos de defensa, aun en
        caso de reclamos infundados) que se origine, directa o indirectamente, en (i) el
        contenido, desarrollo o resultado de las Sesiones o Talleres brindados por dicho
        Profesional; (ii) el incumplimiento de sus obligaciones legales, fiscales, profesionales o
        de las declaradas en la Sección 5; o (iii) cualquier hecho u omisión que le sea atribuible.
      </p>
      <p>
        En particular, si OURO fuera demandada o intimada conjunta o exclusivamente por un
        Consultante en virtud de la responsabilidad solidaria prevista en la Ley 24.240 (ver
        Sección 16) por hechos sustancialmente atribuibles a un Profesional, este último deberá:
        (a) asumir su propia defensa y, a pedido de OURO, intervenir en el proceso; y (b)
        reembolsar a OURO, dentro de los diez (10) días de requerido, todo gasto, honorario o suma
        que OURO hubiera debido afrontar por dicha causa.
      </p>
      <p>
        El Consultante, por su parte, mantendrá indemne a OURO frente a cualquier reclamo derivado
        del uso indebido de la Plataforma de acuerdo con la Sección 15.
      </p>
    </LegalSection>

    <LegalSection number={18} title="Suspensión, Baja y Terminación de Cuentas">
      <p>
        OURO podrá suspender, restringir o dar de baja, en forma temporal o definitiva, la cuenta
        de cualquier usuario que incumpla estos Términos y Condiciones, notificando dicha
        circunstancia por los medios de contacto registrados, sin perjuicio de las acciones
        legales que pudieran corresponder. El usuario podrá solicitar la baja de su cuenta en
        cualquier momento a través de los canales habilitados en la Plataforma.
      </p>
    </LegalSection>

    <LegalSection number={19} title="Comunicaciones">
      <p>
        Toda notificación relacionada con estos Términos y Condiciones se realizará por medios
        electrónicos, a la dirección de correo electrónico o por la cuenta oficial de WhatsApp y
        por redes sociales oficiales de la marca donde tenga contacto directo con cualquier
        usuario de la plataforma, sea terapeuta y/o usuario/consultante.
      </p>
    </LegalSection>

    <LegalSection number={20} title="Modificación de los Términos">
      <p>
        OURO podrá modificar estos Términos y Condiciones en cualquier momento, para reflejar
        cambios normativos, operativos o comerciales. Las modificaciones serán publicadas en la
        Plataforma con indicación de su fecha de vigencia, y se notificará a los usuarios por los
        medios habituales de contacto cuando la modificación sea sustancial. El uso continuado de
        la Plataforma con posterioridad a la entrada en vigencia de las modificaciones implica su
        aceptación.
      </p>
    </LegalSection>

    <LegalSection number={21} title="Divisibilidad">
      <p>
        Si alguna cláusula de estos Términos y Condiciones fuera declarada nula, inválida o
        inaplicable por autoridad competente, dicha declaración no afectará la validez del resto
        de las disposiciones, las cuales mantendrán plena vigencia.
      </p>
    </LegalSection>

    <LegalSection number={22} title="Ley Aplicable y Jurisdicción">
      <p>
        Estos Términos y Condiciones se rigen por las leyes de la República Argentina. Para toda
        controversia derivada de su interpretación o aplicación, las partes se someten a la
        jurisdicción de los tribunales ordinarios competentes de la ciudad de San Martín de los
        Andes, Provincia del Neuquén, sin perjuicio de las normas de jurisdicción que resulten de
        aplicación obligatoria en materia de relaciones de consumo, conforme al domicilio del
        consultante y/o terapeuta.
      </p>
    </LegalSection>

    <LegalSection number={23} title="Contacto">
      <p>
        Ante cualquier consulta relacionada con estos Términos y Condiciones, el usuario podrá
        comunicarse a través del correo electrónico{' '}
        <a
          href="mailto:ouro.contacto2026@gmail.com"
          className="text-gold hover:text-gold-bright transition-colors duration-300 underline underline-offset-2"
        >
          ouro.contacto2026@gmail.com
        </a>{' '}
        y por WhatsApp al{' '}
        <a
          href="https://wa.me/5493413021109"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold hover:text-gold-bright transition-colors duration-300 underline underline-offset-2"
        >
          0341 302-1109
        </a>
        , de lunes a viernes en el horario de 9:00 a 15:00h.
      </p>
    </LegalSection>

  </LegalDocumentLayout>
);

export default TermsPage;
