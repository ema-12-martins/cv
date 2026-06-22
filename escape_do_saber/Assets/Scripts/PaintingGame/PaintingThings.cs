using UnityEngine;
using System.Linq; 

public class PaintingThings : MonoBehaviour
{
    public static int color = 0;

    /* Color Map:
    0 = null
    1 = magenta
    2 = cyan
    3 = yellow
    4 = orange
    5 = green
    6 = violet
    7 = strange brown
    8 = water
    */

    private readonly int[] FinalColors = { 3, 1, 1, 5, 5, 2, 2, 4, 4 };
    private int[] ActualColors = { 6, 1, 2, 2, 4, 1, 5, 3, 1 };

    [Header("Sounds")]
    public ActivateSound finishGameSounds;

    [Header("Finish Game")]
    public GamesManager gamesManager;
    public void completeColorGame(int butterflyPart)
    {

        ActualColors[butterflyPart - 1] = color;

        if (FinalColors.SequenceEqual(ActualColors))
        {
            Debug.Log("Acabou o jogo!");
            finishGameSounds.PlaySound();

            gamesManager.paintingGame = 1;
            gamesManager.changeCanvas(1);
            gamesManager.completeAllGames();
        }

        Debug.Log("Current Colors: " + string.Join(", ", ActualColors));
        Debug.Log("Final Colors: " + string.Join(", ", FinalColors));
    }
}