using System.Collections.Generic;
using UnityEngine;

public class GamesManager : MonoBehaviour
{
    public int paintingGame = 0;
    public int englishGame = 0;
    public int scienceGame = 0;

    [Header("Door")]
    public Transform door;

    [Header("List Canvas")]
    public GameObject paintingCanvas;
    public GameObject englishCanvas;
    public GameObject scienceCanvas;
    public GameObject graduationCanvas;

    [Header("List Materials")]
    public Material paintingMaterial;
    public Material englishMaterial;
    public Material scienceMaterial;
    public Material graduationMaterial;

    private bool finished = false;

    public void changeCanvas(int index) //1=painting 2=english 3=science 4=graduation gap
    {
        if (index == 1)
        {
            paintingCanvas.GetComponent<Renderer>().material = paintingMaterial;
        }
        else if (index == 2)
        {
            englishCanvas.GetComponent<Renderer>().material = englishMaterial;
        }
        else if (index == 3)
        {
            scienceCanvas.GetComponent<Renderer>().material = scienceMaterial;
        }else if (index == 4) {
            graduationCanvas.GetComponent<Renderer>().material = graduationMaterial;
        }
    }

    public void completeAllGames()
    {
        if (paintingGame == 1 && englishGame == 1 && scienceGame == 1 && !finished)
        {
            Debug.Log("All games were finished.");

            door.Rotate(0, 90, 0);

            finished = true;
        }
    }
}