using UnityEngine;

public class Logic_Inside : ChallengeBase
{
    [Header("Target")]
    public GameObject ball;
    
    [Header("Container")]
    public GameObject mugObject;
    public MugCollision mugCollision;

    [Header("Zone")]
    public ShelfZone shelfZone;    // The zone where the mug must be placed (Top Shelf)

    public override bool CheckCompletion()
    {
        // 1. Check if the ball is physically inside the mug
        bool isBallInMug = mugCollision.IsBallInside(ball);

        // 2. Check if the mug itself is resting in the required shelf zone
        bool isMugOnShelf = shelfZone.ContainsObject(mugObject);

        // Both must be true for the challenge to be complete
        return isBallInMug && isMugOnShelf;
    }
}