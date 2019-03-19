import { compile } from 'handlebars';

const resetPasswordTemplate = compile(`
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Arial"></mj-all>
      <mj-text font-weight="400" font-size="16px" color="#000000" line-height="24px" font-family="Arial"></mj-text>
    </mj-attributes>
    <mj-style inline="inline">
      .body-section { -webkit-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); -moz-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); }
    </mj-style>
    <mj-style inline="inline">
      .text-link { color: #5e6ebf }
    </mj-style>
    <mj-style inline="inline">
      .footer-link { color: #888888 }
    </mj-style>

  </mj-head>
  <mj-body background-color="#ffffff" width="520px" height="827px" border-radius="4px">
    <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="40px">
      <mj-column width="40%">
        <mj-image align="left" src="https://storage.googleapis.com/bitbloq-dev/1550495188742logo-vertical.png" width="120px" height="55.2px" alt=""  />
      </mj-column>
      <mj-column width="60%">
      </mj-column>
    </mj-section>
    <mj-section padding-top="1px" padding-bottom="1px" background-color="#ffffff">
      <mj-column width="100%">
        <mj-image align="left" width="520px" src="https://storage.googleapis.com/bitbloq-dev/1550567814460color-line.png" height="1px" />
      </mj-column>
    </mj-section>
    
    <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
      <mj-column width="100%">
        <mj-text color="#313741" font-size="24px">
          ¡Hola!
        </mj-text>
        <mj-text color="#313741" font-size="14px">
          Has solicitado cambiar la contraseña de tu cuenta. Para hacerlo, pulsa en el enlace correspondiente o copia y pega la URL en el navegador:
        </mj-text>
        <mj-button background-color="#ebebeb" align="center" color="#313741" font-size="14px" font-weight="bold" href="{{activationUrl}}" width="420px" height="110px" border-radius="4px">
          {{resetPasswordUrl}}
        </mj-button>
        <mj-text color="#313741" font-size="14px">
          Recuerda: desde que recibas este email, el enlace estará activo sólo durante 30 minutos.
        </mj-text>
        <mj-text color="#313741" font-size="14px" padding-bottom="0">
          Un saludo,
          <p>el equipo de Bitbloq.</p>
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section padding-top="1px" padding-bottom="1px" background-color="#fbfbfb">

    </mj-section>
    <mj-wrapper full-width="full-width">
        <mj-section background-color="#ffffff" >
            <mj-column width="100%">
                <mj-image src="https://storage.googleapis.com/bitbloq-dev/1550495155938logo-letras.png" width="100px" height="20.9px" border-radius="4px" padding="0"/>
            </mj-column>
        </mj-section>
    </mj-wrapper>

  </mj-body>
</mjml>
  `);

export { resetPasswordTemplate };
