import { Card, Section } from "@/components/site/ModulePage";
import { ArenaGame } from "@/modules/game/ArenaGame";

export function Modulo15() {
  return (
    <>
      <Section title="Arena Integral" eyebrow="Juego">
        <p>
          Pon a prueba lo aprendido en los 14 módulos peleando en tiempo real. Durante el combate
          aparecen <strong>orbes de poder</strong>: al tocarlos el juego se pausa y debes responder
          una pregunta básica del tema. Si aciertas, obtienes el poder; si fallas, quedas lento unos
          segundos.
        </p>
        <ArenaGame />
      </Section>

      <Section title="Cómo jugar" eyebrow="Instrucciones">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="font-semibold">Campaña</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Cinco jefes, uno por bloque de temas, con ataques cada vez más difíciles. Al vencer a
              uno se desbloquea el siguiente. Las preguntas salen de los módulos de ese jefe.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold">Duelo</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Dos jugadores en el mismo equipo. Elige si las preguntas salen de todos los módulos o
              de un bloque. Gana quien deje al rival sin vida.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold">Controles</h3>
            <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
              <li>
                <strong>Campaña:</strong> W A S D o flechas para moverte; Espacio, F, J o clic para
                disparar.
              </li>
              <li>
                <strong>Duelo:</strong> azul W A S D + F; rojo flechas + L (o Enter).
              </li>
              <li>
                <strong>Celular:</strong> joystick y botón de fuego en pantalla.
              </li>
              <li>Los disparos apuntan solos al rival. Esc o P: pausa. Teclas 1–4: responder.</li>
            </ul>
          </Card>
        </div>
      </Section>
    </>
  );
}
