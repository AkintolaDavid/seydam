import { useState, useRef } from "react";
import { FiUpload, FiFileText, FiCheckCircle } from "react-icons/fi";
import logo from "../assets/logo/logowhitebg.png";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Input,
  Textarea,
  Button,
  Flex,
  Text,
  Progress,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const ReportForm = () => {
  const [topic, setTopic] = useState("");
  const [understanding, setUnderstanding] = useState("");
  const [guidelines, setGuidelines] = useState("");
  const [files, setFiles] = useState([]);
  const [includeImages, setIncludeImages] = useState(false);
  const [referenceCount, setReferenceCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();
  const navigate = useNavigate();
  // Import baseUrl from environment variables
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("seydamtoken");
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleReferenceChange = (e) => {
    const value = parseInt(e.target.value);

    if (isNaN(value)) {
      setReferenceCount(5);
      return;
    }

    if (value > 100) {
      setReferenceCount(100);
      return;
    }

    setReferenceCount(value);
  };

  const incrementReferences = () => {
    if (referenceCount < 100) {
      setReferenceCount((prev) => {
        // Ensure it's a multiple of 5
        const newValue = prev + 5;
        return newValue > 100 ? 100 : newValue;
      });
    }
  };

  const decrementReferences = () => {
    setReferenceCount((prev) => {
      const newValue = prev - 5;
      return newValue < 0 ? 0 : newValue;
    });
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   navigate("/report-structure");
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${baseUrl}outline/`,
        {
          topic,
          description: understanding,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log(response);
      // // Prepare form data
      // const payload = {
      //   topic,
      //   understanding,
      //   // guidelines,
      //   // includeImages,
      //   // referenceCount,
      //   // files,
      // };
      // console.log(payload);
      // const response = await fetch(`${baseUrl}outline/`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Token ${token}`,
      //   },
      //   body: payload,
      // });
      // console.log(response);
      // if (!response.ok) {
      //   throw new Error("Failed to submit report");
      // }

      // Show success message
      toast({
        title: "Report Form Submitted",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      // Reset form
      setTopic("");
      setUnderstanding("");
      setGuidelines("");
      setFiles([]);
      setIncludeImages(false);
      setReferenceCount(5);
      const structureData = response.data;
      console.log(structureData);
      // Navigate to structure editor with the data
      navigate("/report-structure", {
        state: { structureData, topic: topic, description: understanding },
      });
    } catch (error) {
      toast({
        title: error.response?.data?.error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto px-6 sm:px-10 mt-10 sm:mt-14 mb-10 sm:mb-4">
      {/* <div className="w-full flex justify-center items-center">
        <img src={logo} className="h-16 mb-16" />
      </div> */}
      {isSubmitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-800 border-solid" />
        </div>
      )}

      <div className="border border-gray-800 rounded-lg">
        <Card className=" rounded-lg overflow-hidden">
          <CardHeader className="bg-gray-800 text-white py-3 px-4 text-center">
            <Heading size="md">Enter your report information</Heading>
          </CardHeader>

          <CardBody className="p-4">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="topic"
                    className="block text-gray-800 font-medium mb-1"
                  >
                    Report Title
                  </label>
                  <Input
                    id="topic"
                    placeholder="Enter the title of your report"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="border-gray-800 focus:border-gray-800 focus:ring-gray-800"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="understanding"
                    className="block text-gray-800 font-medium mb-1"
                  >
                    Personal Understanding of the Topic
                  </label>
                  <Textarea
                    id="understanding"
                    placeholder="Describe your current understanding of this topic"
                    value={understanding}
                    onChange={(e) => setUnderstanding(e.target.value)}
                    className="min-h-[150px] border-gray-800 focus:border-gray-800 focus:ring-gray-800"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 py-2">
                  <input
                    type="checkbox"
                    id="include-images"
                    checked={includeImages}
                    onChange={(e) => setIncludeImages(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-800 text-gray-800 focus:ring-gray-800"
                  />
                  <label
                    htmlFor="include-images"
                    className="text-gray-800 font-medium"
                  >
                    Include images in the report
                  </label>
                </div>

                <div>
                  <label
                    htmlFor="references"
                    className="block text-gray-800 font-medium mb-1"
                  >
                    Number of References
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="references"
                      type="number"
                      min="5"
                      max="100"
                      step="5"
                      value={referenceCount}
                      onChange={handleReferenceChange}
                      className="border-gray-800 focus:border-gray-800 focus:ring-gray-800"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      colorScheme="blue"
                      onClick={incrementReferences}
                      className="border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-gray-800"
                    >
                      +5
                    </Button>
                    <Button
                      type="button"
                      colorScheme="blue"
                      variant="outline"
                      onClick={decrementReferences}
                      className="border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-gray-800"
                    >
                      -5
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-800 mt-1">
                    <span>Must be a multiple of 5 (max 100)</span>
                    <span>{referenceCount}/100</span>
                  </div>
                  <Progress
                    value={(referenceCount / 100) * 100}
                    size="sm"
                    colorScheme="blue"
                    className="mt-1 rounded-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-800 font-medium mb-1">
                    Guidelines for Report
                  </label>
                  <div className="border-2 border-dashed border-gray-800 rounded-lg p-4 bg-white hover:bg-gray-800transition-colors">
                    <Flex alignItems="center" justifyContent="space-between">
                      <Flex alignItems="center">
                        <FiUpload className="h-5 w-5 text-gray-800 mr-2" />
                        <Box>
                          <Text className="text-sm font-medium text-gray-800">
                            Upload guideline documents
                          </Text>
                          <Text className="text-xs text-gray-800">
                            Drag and drop files here or click to browse
                          </Text>
                        </Box>
                      </Flex>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                      <Button
                        type="button"
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-gray-800"
                      >
                        Select Files
                      </Button>
                    </Flex>
                  </div>

                  {files.length > 0 && (
                    <div className="bg-gray-800p-3 rounded-md mt-2 max-h-[150px] overflow-y-auto">
                      <p className="text-sm font-medium text-gray-800 mb-1">
                        Selected files:
                      </p>
                      <ul className="space-y-1">
                        {files.map((file, index) => (
                          <li
                            key={index}
                            className="flex items-center text-sm text-gray-800"
                          >
                            <FiFileText className="h-4 w-4 mr-2" />
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Textarea
                    id="guidelines"
                    placeholder="Type additional guidelines or instructions for your report"
                    value={guidelines}
                    onChange={(e) => setGuidelines(e.target.value)}
                    className="min-h-[150px] mt-2 border-gray-800 focus:border-gray-800 focus:ring-gray-800"
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    isLoading={isSubmitting}
                    loadingText="Submitting..."
                    className="w-full bg-gray-800 hover:bg-gray-800 text-white py-2 rounded-lg"
                  >
                    Submit Report Information
                  </button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ReportForm;
