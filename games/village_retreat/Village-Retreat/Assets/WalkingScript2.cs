using UnityEngine;
using FMODUnity;

public class WalkingScript2 : StateMachineBehaviour
{
    [EventRef]
    public string footstepSound = "event:/Character/footsteps2";

    [Range(0f, 1f)]
    public float volume = 1f; // Controle de volume (0 = mudo, 1 = volume máximo)

    // Armazena a instância do som para poder controlá-la
    private FMOD.Studio.EventInstance footstepInstance;

    override public void OnStateEnter(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        // Cria uma instância do som
        footstepInstance = RuntimeManager.CreateInstance(footstepSound);

        // Define o volume
        footstepInstance.setVolume(volume);

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

    // Se quiser atualizar o volume em tempo real durante a animação
    override public void OnStateUpdate(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        // Atualiza a posição do som enquanto o personagem se move
        footstepInstance.set3DAttributes(RuntimeUtils.To3DAttributes(animator.transform));

        // Atualiza o volume se necessário
        footstepInstance.setVolume(volume);
    }
}