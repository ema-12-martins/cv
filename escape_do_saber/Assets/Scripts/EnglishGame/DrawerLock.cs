using UnityEngine;

public class DrawerLock : MonoBehaviour
{
    private ConfigurableJoint drawerJoint;
    private float openLimit; // Remember how far it opens

    void Start()
    {
        drawerJoint = GetComponent<ConfigurableJoint>();

        // 1. Save the "Open" limit you set in the Inspector
        openLimit = drawerJoint.linearLimit.limit;

        // 2. Lock it immediately by setting the limit to almost zero
        SetLimit(0.001f);
    }

    public void Unlock()
    {
        Debug.Log("Physical Lock Disengaged");
        // Restore the limit so it can slide open
        SetLimit(openLimit);
    }

    private void SetLimit(float limitValue)
    {
        // In Unity, to change a struct like SoftJointLimit, 
        // you must get it, modify it, and assign it back.
        SoftJointLimit limit = drawerJoint.linearLimit;
        limit.limit = limitValue;
        drawerJoint.linearLimit = limit;
    }
}