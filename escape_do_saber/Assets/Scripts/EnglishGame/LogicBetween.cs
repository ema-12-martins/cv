using System;
using UnityEngine;

public class Logic_Between : ChallengeBase
{
    [Header("Objects")]
    public Transform leftLimitObj;  // e.g., The Black Cat
    public Transform middleObj;     // e.g., The Heavy Statue
    public Transform rightLimitObj; // e.g., The Red Book
    
    [Header("Zone")]
    public ShelfZone shelfZone;     // Ensure they are actually on the shelf!

    public override bool CheckCompletion()
    {
        // 1. Are they all in the shelf?
        bool allInZone = shelfZone.ContainsObject(leftLimitObj.gameObject) &&
                         shelfZone.ContainsObject(middleObj.gameObject) &&
                         shelfZone.ContainsObject(rightLimitObj.gameObject);

        if (!allInZone) return false;

        // 2. Check X-Axis Order
        float z1 = leftLimitObj.position.z;
        float z2 = middleObj.position.z;
        float z3 = rightLimitObj.position.z;

        // Check if Middle is strictly between Left and Right
        // We use Math.Min and Max because the user might put the cat on the right or left, 
        // as long as the statue is in the middle, it counts.
        bool isBetween = (z2 > Mathf.Min(z1, z3)) && (z2 < Mathf.Max(z1, z3));

        return isBetween;
    }
}