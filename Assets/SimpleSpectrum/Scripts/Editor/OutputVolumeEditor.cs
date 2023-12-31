﻿/*
OutputVolumeEditor.cs - Part of Simple Spectrum V2.1 by Sam Boyer.
*/

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;

[CustomEditor(typeof(OutputVolume))]
[CanEditMultipleObjects]
public class OutputVolumeEditor : Editor
{
    private SerializedProperty propertyWindow;

    private SerializedProperty propertyEnabled;

    private SerializedProperty propertySourceType;
    private SerializedProperty propertyAudioSource;
    private SerializedProperty propertySampleAmount;
    private SerializedProperty propertyChannel;
    private SerializedProperty propertyAttackDamp;
    private SerializedProperty propertyDecayDamp;

    private SerializedProperty propertyOutputType;
    private SerializedProperty propertyValueMultiplier;
    private SerializedProperty propertyOutputScaleMin;
    private SerializedProperty propertyOutputScaleMax;
    private SerializedProperty propertyBarPrefab;
    private SerializedProperty propertyScalePrefab;
    private SerializedProperty propertyUseColorGradient;
    private SerializedProperty propertyMinColor;
    private SerializedProperty propertyMaxColor;
    private SerializedProperty propertyColorCurve;
    private SerializedProperty propertyColorAttackDamp;
    private SerializedProperty propertyColorDecayDamp;

    private bool foldoutSamplingOpen = true;
    private bool foldoutOutputOpen = true;

    private void OnEnable()
    {
        propertyEnabled = serializedObject.FindProperty("isEnabled");

        propertySourceType = serializedObject.FindProperty("sourceType");
        propertyAudioSource = serializedObject.FindProperty("audioSource");
        propertySampleAmount = serializedObject.FindProperty("sampleAmount");
        propertyChannel = serializedObject.FindProperty("channel");
        propertyAttackDamp = serializedObject.FindProperty("attackDamp");
        propertyDecayDamp = serializedObject.FindProperty("decayDamp");

        propertyOutputType = serializedObject.FindProperty("outputType");
        propertyValueMultiplier = serializedObject.FindProperty("valueMultiplier");
        propertyOutputScaleMin = serializedObject.FindProperty("outputScaleMin");
        propertyOutputScaleMax = serializedObject.FindProperty("outputScaleMax");
        propertyBarPrefab = serializedObject.FindProperty("prefab");
        propertyScalePrefab = serializedObject.FindProperty("scalePrefab");
        propertyUseColorGradient = serializedObject.FindProperty("useColorGradient");
        propertyMinColor = serializedObject.FindProperty("MinColor");
        propertyMaxColor = serializedObject.FindProperty("MaxColor");
        propertyColorCurve = serializedObject.FindProperty("colorCurve");
        propertyColorAttackDamp = serializedObject.FindProperty("colorAttackDamp");
        propertyColorDecayDamp = serializedObject.FindProperty("colorDecayDamp");
    }

    public override void OnInspectorGUI()
    {
        serializedObject.Update();

        EditorGUILayout.LabelField("A simple volume display by Sam Boyer.", new GUIStyle { fontSize = 10 });

#if UNITY_WEBGL
        EditorGUILayout.LabelField(
            "NOTE: OutputVolume works with WebGL, but only under certain conditions. Check the docs!",
            new GUIStyle { wordWrap = true });
#endif

        EditorGUILayout.PropertyField(propertyEnabled);

        foldoutSamplingOpen = EditorGUILayout.Foldout(foldoutSamplingOpen, "Sampling Settings");
        if (foldoutSamplingOpen)
        {
#if UNITY_WEBGL
            EditorGUILayout.LabelField("Only AudioListener can be used with WebGL.", new GUIStyle { wordWrap = true });
#endif
            EditorGUILayout.PropertyField(propertySourceType);

            if (propertySourceType.enumValueIndex == 0) //audioSource
                EditorGUILayout.PropertyField(propertyAudioSource);

            if (propertySourceType.enumValueIndex == 2) //custom
                EditorGUILayout.LabelField("Use the inputValue property to set your own data.",
                    new GUIStyle { fontSize = 10, wordWrap = true });

#if UNITY_WEBGL
            EditorGUILayout.LabelField("The number of samples used is shared globally.",
                new GUIStyle { wordWrap = true });
#endif
            EditorGUILayout.PropertyField(propertySampleAmount);
            EditorGUILayout.PropertyField(propertyChannel);

            EditorGUILayout.PropertyField(propertyAttackDamp);
            EditorGUILayout.PropertyField(propertyDecayDamp);
        }

        foldoutOutputOpen = EditorGUILayout.Foldout(foldoutSamplingOpen, "Output Settings");
        if (foldoutOutputOpen)
        {
            EditorGUILayout.PropertyField(propertyOutputType);

            switch (propertyOutputType.enumValueIndex)
            {
                case 0: //prefab
                    EditorGUILayout.PropertyField(propertyBarPrefab);
                    EditorGUILayout.PropertyField(propertyScalePrefab);
                    EditorGUILayout.PropertyField(propertyUseColorGradient);

                    if (propertyUseColorGradient.boolValue)
                    {
                        EditorGUILayout.PropertyField(propertyMinColor);
                        EditorGUILayout.PropertyField(propertyMaxColor);
                        EditorGUILayout.PropertyField(propertyColorCurve);
                        EditorGUILayout.PropertyField(propertyColorAttackDamp);
                        EditorGUILayout.PropertyField(propertyColorDecayDamp);
                    }

                    break;

                case 1: //pos
                    EditorGUILayout.LabelField(
                        "Use the Value Multiplier to scale and mask different dimensions for positioning.",
                        new GUIStyle { fontSize = 10, wordWrap = true });
                    EditorGUILayout.PropertyField(propertyValueMultiplier);
                    break;

                case 2: //rot
                    EditorGUILayout.LabelField(
                        "Use the Value Multiplier to scale and mask different dimensions for rotation.",
                        new GUIStyle { fontSize = 10, wordWrap = true });
                    EditorGUILayout.PropertyField(propertyValueMultiplier);
                    break;

                case 3: //scale
                    EditorGUILayout.PropertyField(propertyOutputScaleMin);
                    EditorGUILayout.PropertyField(propertyOutputScaleMax);
                    break;
            }
        }


        serializedObject.ApplyModifiedProperties();
    }
}