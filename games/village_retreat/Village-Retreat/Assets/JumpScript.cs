using UnityEngine;
using FMODUnity;

public class JumpScript : StateMachineBehaviour
{
    [EventRef]
    public string jumpSound = "event:/Character/Jumping";

    // Jump sound typically doesn't need an instance since it's a one-shot
    // But we'll include instance version for completeness

    private FMOD.Studio.EventInstance jumpInstance;
    private bool hasPlayed = false;

    override public void OnStateEnter(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        // Reset play state when entering jump animation
        hasPlayed = false;

        // Simple one-shot version (most common for jumps)
        RuntimeManager.PlayOneShot(jumpSound, animator.transform.position);
        hasPlayed = true;

        /* Alternative version with instance control (if needed)
        jumpInstance = RuntimeManager.CreateInstance(jumpSound);
        jumpInstance.set3DAttributes(RuntimeUtils.To3DAttributes(animator.transform));
        jumpInstance.start();
        */
    }

    override public void OnStateExit(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        /* If using instance version:
        jumpInstance.stop(FMOD.Studio.STOP_MODE.IMMEDIATE);
        jumpInstance.release();
        */
    }

    // Optional: For precise timing if jump has multiple phases
    override public void OnStateUpdate(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        // Example: Play sound only when reaching peak of jump
        /*
        if (!hasPlayed && stateInfo.normalizedTime >= 0.5f)
        {
            RuntimeManager.PlayOneShot(jumpSound, animator.transform.position);
            hasPlayed = true;
        }
        */
    }
}