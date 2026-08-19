using UnityEngine;
using FMODUnity;

public class WalkingScript : StateMachineBehaviour
{
    [EventRef]
    public string footstepSound = "event:/Character/footsteps1";

    // Armazena a instância do som para poder controlá-la
    private FMOD.Studio.EventInstance footstepInstance;

    override public void OnStateEnter(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        // Cria uma instância do som
        footstepInstance = RuntimeManager.CreateInstance(footstepSound);

        // Define a posição 3D do som
        footstepInstance.set3DAttributes(RuntimeUtils.To3DAttributes(animator.transform));

        // Inicia o som
        footstepInstance.start();
    }

    override public void OnStateExit(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        // Para o som suavemente
        footstepInstance.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);

        // Libera os recursos da instância
        footstepInstance.release();
    }

    // Opcional: Se precisar de controle mais preciso durante o estado
    // override public void OnStateUpdate(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    // {
    //     // Atualiza a posição do som enquanto o personagem se move
    //     footstepInstance.set3DAttributes(RuntimeUtils.To3DAttributes(animator.transform));
    // }
}