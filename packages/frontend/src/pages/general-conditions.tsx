import React from "react";
import { NextPage } from "next";
import { useTranslate } from "@bitbloq/ui";
import withApollo from "../apollo/withApollo";
import LandingHeader from "../components/LandingHeader";
import LandingFooter from "../components/LandingFooter";
import Layout from "../components/Layout";
import styled from "@emotion/styled";

const GeneralConditionsPage: NextPage = () => {
  const t = useTranslate();

  return (
    <>
      <LandingHeader fixed={true} />
      <Layout>
        <Header>{t("general-conditions.title")}</Header>
        <Content>
          <h1>Introducción</h1>
          <p>
            1.1. Las siguientes Condiciones Generales regulan la relación entre
            Mundo Reader, S.L, (en adelante, Mundo Reader) y los usuarios de
            Bitbloq y de todos su servicios. Utilizando Bitbloq, el usuario se
            compromete a haber leído, entendido y aceptado estas condiciones.
          </p>
          <br />
          <p>
            1.2. Las condiciones están sujetas a cambios y actualizaciones, por
            lo que la fecha de la última modificación figurará siempre al final
            de estas. Es responsabilidad de los usuarios informarse de los
            cambios que afectan a estas condiciones, pues continuando con el uso
            de Bitbloq está aceptando tácitamente las modificaciones.
          </p>
          <br />
          <p>
            1.3. Bitbloq se rige por la legislación española y, en caso de ser
            precisa una mediación judicial, ésta se someterá a los juzgados y
            tribunales de España. Mundo Reader no puede asegurar que el
            contenido de Bitbloq se ajuste a la legislación del resto de países.
            Igualmente, aunque las condiciones generales estén en múltiples
            idiomas, en caso de colisión entre traducciones, primará la versión
            española.
          </p>
          <br />
          <p>
            1.4. Usando Bitbloq, el usuario acepta que esta plataforma gratuita
            carece de todo tipo de garantía. El servicio puede estar sujeto a
            interrupciones, caídas, fallos provisionales, pérdida de información
            o similar y bajo ningún concepto esto conllevará ningún tipo de
            compensación, económica o de cualquier otro tipo, para el usuario.
          </p>
          <br />

          <h1>Cuentas de usuarios</h1>
          <p>
            2.1. Para utilizar Bitbloq no es necesario tener cuenta de usuario.
            Sin embargo, sin ella no será posible guardar o publicar proyectos
            ni dejar comentarios. Para crearla, el usuario debe proporcionar sus
            datos de registro. Consulte el apartado 6 Privacidad y cookies.
          </p>
          <br />
          <p>
            2.2. Cada cuenta debe ser utilizada por un único usuario, no siendo
            posible compartirla entre dos o más personas.
          </p>
          <br />
          <p>
            2.3. Mundo Reader podrá suspender provisionalmente o eliminar
            definitivamente una cuenta si esta viola alguno de los puntos
            recogidos en las Condiciones Generales de Uso. Mundo Reader se
            reserva el derecho a determinar qué constituye una infracción de
            estas condiciones y qué medidas debe tomar al respecto (suspensión o
            eliminación definitiva de la cuenta). El usuario cuya cuenta sea
            borrada no podrá volver a crear una nueva y, si la administración
            detectara que ha generado una nueva, procederá a su eliminación.
          </p>
          <br />
          <p>
            2.4. Si un usuario quiere dar de baja su cuenta debe solicitarlo por
            correo electrónico a soporte.bitbloq@bq.com.
          </p>
          <br />
          <p>
            2.5. Con carácter general, el acceso y uso de Bitbloq no está
            permitido a los usuarios menores de 14 años que no cuenten con la
            debida autorización parental de sus padres y/o tutores legales por
            lo que, mediante la aceptación de estas Condiciones manifiestas ser
            mayor de esa edad o, en su caso, contar con dicha autorización
            previa, responsabilizándose enteramente de esta declaración. Bitbloq
            podrá ponerse en contacto contigo, en cualquier momento, para que
            demuestres tu edad real aportándonos un documento oficial y, en su
            caso, que cuentas con la necesaria autorización parental. En el caso
            de que no nos facilites dicha documentación, Bitbloq podrá
            desactivar temporalmente y/o cancelar tu perfil.
          </p>
          <br />

          <h1>Reglas de convivencia</h1>
          <p>
            3.1. En Bitbloq los usuarios pueden intercambiar sus proyectos y
            comentarios y dejar sus opiniones. Utilizándolo, los usuarios se
            comprometen a respetar unas reglas de convivencia. Por ello, será
            eliminado de Bitbloq: Todo contenido soez, explícito o violento; los
            comentarios que difamen a terceros, independientemente de si son
            personas físicas o empresas; los comentarios o contenidos que
            promuevan la discriminación hacia individuos o grupos, así como que
            aquellos que ataquen o inciten a la violencia contra estos;
            igualmente, se eliminarán aquellos comentarios que amenacen,
            intimiden o degraden a terceros, sean o no usuarios de Bitbloq; los
            comentarios en los que hable de productos ilegales o se incite a
            cometer actividades ilegales,; los comentarios en los que se
            soliciten o proporcionen datos personales, de contacto o
            contraseñas, con o sin autorización del usuario; los contenidos o
            comentarios publicados repetidamente y que Mundo Reader considere
            que constituyen spam; los comentarios o contenidos de tinte
            publicitario y promocional; los enlaces a páginas de terceros que
            contengan virus o malware o que Mundo Reader sospeche que son
            susceptibles de tenerlos.
          </p>
          <br />
          <p>
            3.2. Los usuarios no pueden identificarse como administradores de
            Bitbloq ni tratar de ser confundidos con estos.
          </p>
          <br />
          <p>
            3.3. Los usuarios se comprometen a no enlazar contenido a Bitbloq si
            este viola parte de estas condiciones generales.
          </p>
          <br />
          <p>
            3.4. A pesar de que estas reglas son claras, es posible que algunos
            usuarios utilicen Bitbloq de una forma que las infrinja. Por ello,
            utilizando Bitbloq, el usuario asume que puede toparse
            accidentalmente con contenido ofensivo. Mundo Reader no puede
            comprometerse a monitorizar toda la actividad en Bitbloq debido a su
            volumen, por lo que anima a los usuarios a reportar aquel contenido
            que no respeta estas condiciones.
          </p>
          <br />
          <p>
            3.5. Los usuarios que Mundo Reader considere que reportan de forma
            injustificada constantemente serán sancionados por la
            administración.
          </p>
          <br />
          <p>
            3.6. Mundo Reader no se responsabiliza de las opiniones o los
            consejos vertidos en Bitbloq por los usuarios, que lo hacen a título
            personal.
          </p>
          <br />

          <h1>Contenido y licencias</h1>
          <p>
            4.1. Por contenido se entiende cualquier proyecto, comentario,
            enlace o, en general, aportación que se haga en el foro.
          </p>
          <br />
          <p>
            4.2. Todo el contenido generado por los usuarios se hace bajo la
            licencia Creative Commons Attribution-ShareAlike 2.0., lo que
            permite a otros usuarios y a Mundo Reader compartirlo, adaptarlo y
            reproducirlo. Sin embargo, siempre deberá darse crédito a su autor,
            citándolo, incluso si se ha aplicado algún cambio a partir del
            material original. Si un usuario no quiere que su contenido esté
            bajo esta licencia, no debe compartirlo en Bitbloq.
          </p>
          <br />
          <p>
            4.3. Es responsabilidad de los usuario no compartir contenido que
            tenga derechos de autor en Bitbloq. Si un particular o compañía
            considera que algún contenido subido a Bitbloq viola sus derechos de
            autor, puede enviar un correo a soporte.bitbloq@bq.com.
          </p>
          <br />
          <p>
            4.4. Todo el material generado por Mundo Reader y subido a Bitbloq
            está bajo licencia Creative Commons Attribution-ShareAlike 4.0. Por
            ello, cuando se utilicen imágenes de Bitbloq, deben situarse junto a
            la frase “Bitbloq es desarrollado por BQ. Ver página bitbloq.bq.com.
          </p>
          <br />
          <p>
            4.5. La marca Bitbloq y su logo son propiedad de Mundo Reader y solo
            es posible utilizar el logo para referirse a la página de Bitbloq o
            a su lenguaje de programación, estando prohibido su uso para
            cualquier otro fin (excepto autorización expresa y previa de Mundo
            Reader). Bajo ningún concepto podrá utilizarse la marca o el logo de
            Bitbloq para apoyar o promover servicios o productos de terceros.
            Mundo Reader posee todos los derechos del código, diseño,
            funcionalidades y arquitectura de Bitbloq, excepto del contenido
            generado por los usuarios. Los usuarios no tienen ningún tipo de
            derecho sobre Bitbloq o su código fuente, que está sujeto a
            copyright.
          </p>
          <br />

          <h1>Páginas de terceros</h1>
          <p>
            El contenido subido por los usuarios puede incluir links a páginas
            de terceros con las que Mundo Reader no tiene relación alguna. Mundo
            Reader no se hace responsable de los problemas de privacidad,
            seguridad o funcionalidad que pueda conllevar el acceso a esas
            páginas. Lo usuarios, accediendo a estas web a través de los links,
            lo hacen bajo su entera responsabilidad.
          </p>
          <br />

          <h1>Política de privacidad</h1>
          <p>
            Los datos de carácter personal proporcionados formarán parte de un
            fichero cuyo responsable es Mundo Reader, S.L., el cual se gestiona
            conforme a la normativa española de protección de datos con la
            finalidad de poder prestar este servicio a los usuarios conforme a
            las condiciones generales vigentes. Consulte nuestra la política de
            privacidad en www.bq.com. Creándose una cuenta el usuario reconoce
            que ha leído y acepta las condiciones de la política de privacidad.
            Si tiene cualquier duda respecto a la política o el tratamiento que
            hacemos de sus datos personales, contacte con lopd@bq.com.
          </p>
          <br />

          <h1>Cookies</h1>
          <p>
            La página web https://bitbloq.bq.com a través de la cuál accede a
            este servicio instala en su ordenador cookies técnicas propias de
            Bitbloq necesarias para poder personalizar el idioma del usuario y
            de google.analytics de cara a estadísticas y mejora de la
            experiencia del usuario. En ningún caso recaban información personal
            del usuario. Al utilizar este servicio acepta la instalación de las
            mismas. No obstante, tiene la posibilidad de bloquearlas o
            eliminarlas en cualquier momento, si bien esta acción puede provocar
            pérdidas de funcionalidad en el servicio. Para más información
            consulte nuestra política de cookies en www.bq.com.
          </p>
        </Content>
      </Layout>
      <LandingFooter />
    </>
  );
};

export default withApollo(GeneralConditionsPage, { requiresSession: false });

/* styled components */

const Content = styled.div`
  line-height: 22px;
  font-size: 14px;
  margin-bottom: 80px;
`;

const Header = styled.h1`
  font-size: 30px;
  font-weight: 300;
  text-align: center;
  margin: 80px auto 40px auto;
  line-height: 1.2;
`;
