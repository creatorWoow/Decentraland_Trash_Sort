import * as ui from '@dcl/ui-scene-utils';
import {Garbage} from '../entities/Garbage';
import {IMAGES_PATH} from "../core/Constants";

const POWER_UP_SPEED = 150;

export function initPowerMeterSystem(props: Array<Garbage>) {

    let throwPower = 0;
    let isPowerUp = true;
    let powerMeterSys: PowerMeterSystem;

    /* UI */
    const powerBar = new ui.UIBar(0, -80, 80, Color4.Yellow(), ui.BarStyles.ROUNDWHITE);
    new ui.SmallIcon(IMAGES_PATH + '/powerIcon.png', -101, 85, 90, 23);


    class PowerMeterSystem implements ISystem {
        update(dt: number): void {
            if (throwPower < 1) {
                isPowerUp = true;
            } else if (throwPower > 99) {
                isPowerUp = false;
            }

            if (throwPower > 0 || throwPower < 99) {
                isPowerUp ? (throwPower += dt * POWER_UP_SPEED * 1.1) : (throwPower -= dt * POWER_UP_SPEED); // Powering up is 10% faster
                powerBar.set(throwPower / 100);
                throwPower > 80 ? (powerBar.bar.color = Color4.Red()) : (powerBar.bar.color = Color4.Yellow());
            }
        }
    }

    Input.instance.subscribe('BUTTON_DOWN', ActionButton.POINTER, false, (f) => {
        for (const ball of props) {
            if (ball.isActive && !ball.isThrown) {
                powerBar.bar.visible = true;
                powerBar.background.visible = true;
                throwPower = 1;
                powerMeterSys = new PowerMeterSystem();
                engine.addSystem(powerMeterSys);
            }
        }
    });

    Input.instance.subscribe('BUTTON_UP', ActionButton.POINTER, false,
        (f) => {
            for (const prop of props) {
                if (prop.isActive && !prop.isThrown) {
                    engine.removeSystem(powerMeterSys);
                    powerBar.set(0);

                    const throwDirection = Vector3.Forward().rotate(Camera.instance.rotation); // Camera's forward vector
                    prop.playerThrow(throwDirection, throwPower);
                }
            }
        });
}
