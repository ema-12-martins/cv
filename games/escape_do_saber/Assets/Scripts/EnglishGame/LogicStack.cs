using UnityEngine;
using UnityEngine.XR.Interaction.Toolkit.Interactables;

public class Logic_Stack : ChallengeBase
{
    public GameObject bottomObj; // Basketball
    public GameObject topObj;    // Cube
    public ShelfZone shelfZone;

    public override bool CheckCompletion()
    {
        // 1. Zone Check
        bool inZone = shelfZone.ContainsObject(bottomObj) && shelfZone.ContainsObject(topObj);
        
        // 2. Vertical Check
        bool verticalOrder = topObj.transform.position.y > (bottomObj.transform.position.y + 0.05f);

        // 3. Stability Check
        return inZone && verticalOrder && IsStable(topObj) && IsStable(bottomObj);
    }

    bool IsStable(GameObject obj)
    {
        Rigidbody rb = obj.GetComponent<Rigidbody>();
        XRGrabInteractable grab = obj.GetComponent<XRGrabInteractable>();
        // Check velocity is low AND it is not currently being held
        return rb.linearVelocity.magnitude < 0.05f && !grab.isSelected;
    }
}