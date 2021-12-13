import * as ui from "@dcl/ui-scene-utils";
import { Garbage } from "../classes/Garbage";

export function initPowerMeterSystem(props: Array<Garbage>) {

    let throwPower = 0
    let powerBar = new ui.UIBar(0, -80, 80, Color4.Yellow(), ui.BarStyles.ROUNDWHITE)
    let powerIcon = new ui.SmallIcon("images/powerIcon.png", -101, 85, 90, 23)
    let isPowerUp = true
    const POWER_UP_SPEED = 150

    class PowerMeterSystem implements ISystem {
        update(dt: number): void {
            if (throwPower < 1) {
                isPowerUp = true
            } else if (throwPower > 99) {
                isPowerUp = false
            }

            if (throwPower > 0 || throwPower < 99) {
                isPowerUp ? (throwPower += dt * POWER_UP_SPEED * 1.1) : (throwPower -= dt * POWER_UP_SPEED) // Powering up is 10% faster
                powerBar.set(throwPower / 100)
                throwPower > 80 ? (powerBar.bar.color = Color4.Red()) : (powerBar.bar.color = Color4.Yellow())
            }
        }
    }

    let powerMeterSys: PowerMeterSystem


    Input.instance.subscribe("BUTTON_DOWN", ActionButton.POINTER, false, (f) => {
        for (let ball of props) {
            if (ball.isActive && !ball.isThrown) {
                powerBar.bar.visible = true
                powerBar.background.visible = true
                throwPower = 1
                powerMeterSys = new PowerMeterSystem()
                engine.addSystem(powerMeterSys)
            }
        }
    })

    Input.instance.subscribe("BUTTON_UP", ActionButton.POINTER, false, (f) => {
        for (let ball of props) {
            if (ball.isActive && !ball.isThrown) {
                engine.removeSystem(powerMeterSys)
                powerBar.set(0)

                let throwDirection = Vector3.Forward().rotate(Camera.instance.rotation) // Camera's forward vector
                ball.playerThrow(throwDirection, throwPower)
            }
        }
    })
}