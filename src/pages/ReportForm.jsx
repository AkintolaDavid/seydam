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
import { FaTimes } from "react-icons/fa";
const ReportForm = ({ onClose }) => {
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
          no_of_refs: referenceCount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

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
      console.log(response);
      // Navigate to structure editor with the data
      navigate("/report-structure", {
        state: {
          structureData: structureData?.data?.outline,
          topic: topic,
          description: understanding,
          report_id: response?.data?.report_id,
        },
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
    <div className="w-full sm:w-[600px] lg:w-[900px] mx-auto px-2 sm:px-10 mt-10 sm:mt-14 mb-10 sm:mb-4">
      {/* <div className="w-full flex justify-center items-center">
        <img src={logo} className="h-16 mb-16" />
      </div> */}
      {isSubmitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#060668] border-solid" />
        </div>
      )}

      <div className="border border-[#060668] rounded-lg">
        <Card className=" rounded-lg overflow-hidden">
          <CardHeader className="relative bg-[#060668] text-white py-2 sm:py-3 px-4 text-center">
            <Heading size="md">Enter Report Details</Heading>
            <button
              onClick={onClose}
              className="absolute right-4 sm:right-6 top-[39%] text-[22px]"
            >
              <FaTimes className="text-lg sm:text-xl" />{" "}
            </button>
          </CardHeader>

          <CardBody className="p-4">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <div className="space-y-2 sm:space-y-4">
                <div>
                  <label
                    htmlFor="topic"
                    className="block text-[#060668] font-semibold  mb-1"
                  >
                    Report Title
                  </label>
                  <Input
                    id="topic"
                    placeholder="Enter the title of your report"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="border-[#060668] focus:border-[#060668] focus:ring-[#060668]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="understanding"
                    className="block text-[#060668] font-semibold  mb-1"
                  >
                    Personal Understanding of the Topic
                  </label>
                  <Textarea
                    id="understanding"
                    placeholder="Describe your current understanding of this topic"
                    value={understanding}
                    onChange={(e) => setUnderstanding(e.target.value)}
                    className="min-h-[150px] border-[#060668] focus:border-[#060668] focus:ring-[#060668]"
                    required
                  />
                </div>

                {/* <div className="flex items-center space-x-2 py-2">
                  <label
                    htmlFor="include-images"
                    className="text-[#060668] font-medium  text-lg sm:text-xl"
                  >
                    SHOULD IMAGES BE INCLUDED IN THE REPORT
                  </label>{" "}
                  -{" "}
                  <input
                    type="checkbox"
                    id="include-images"
                    checked={includeImages}
                    onChange={(e) => setIncludeImages(e.target.checked)}
                    className="h-6 w-6 rounded border-[#060668] text-[#060668] focus:ring-[#060668]"
                  />
                </div> */}

                <div>
                  <label
                    htmlFor="references"
                    className="block text-[#060668] font-semibold  mb-1"
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
                      className="border-[#060668] focus:border-[#060668] focus:ring-[#060668]"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      colorScheme="blue"
                      onClick={incrementReferences}
                      className="border-[#060668] text-[#060668] hover:bg-[#060668] hover:text-[#060668]"
                    >
                      +5
                    </Button>
                    <Button
                      type="button"
                      colorScheme="blue"
                      variant="outline"
                      onClick={decrementReferences}
                      className="border-[#060668] text-[#060668] hover:bg-[#060668] hover:text-[#060668]"
                    >
                      -5
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-sm text-[#060668] mt-1">
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
                  <label className="block text-[#060668] font-semibold  mb-1">
                  Add Report Addiontional Information
                  </label>
                  <div className="border-2 border-dashed border-[#060668] rounded-lg p-4 bg-white hover:bg-[#060668]transition-colors">
                    <Flex
                      direction={{ base: "column", sm: "row" }}
                      alignItems="flex-start"
                      justifyContent="space-between"
                      gap={4}
                    >
                      <Flex alignItems="center">
                        <FiUpload className="h-5 w-5 text-[#060668] mr-2" />
                        <Box>
                          <Text className="text-sm font-semibold text-[#060668]">
                            Upload guideline documents
                          </Text>
                          <Text className="text-xs text-[#060668]">
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
                        className="border-[#060668] text-[#060668] hover:bg-[#060668] hover:text-[#060668]"
                      >
                        Select Files
                      </Button>
                    </Flex>
                  </div>

                  {files.length > 0 && (
                    <div className="bg-[#060668]p-3 rounded-md mt-2 max-h-[150px] overflow-y-auto">
                      <p className="text-sm font-semibold  text-[#060668] mb-1">
                        Selected files:
                      </p>
                      <ul className="space-y-1">
                        {files.map((file, index) => (
                          <li
                            key={index}
                            className="flex items-center text-sm text-[#060668]"
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
                    className="min-h-[150px] mt-2 border-[#060668] focus:border-[#060668] focus:ring-[#060668]"
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    isLoading={isSubmitting}
                    loadingText="Submitting..."
                    className="w-full bg-[#060668] hover:bg-[#060668] text-white py-2 rounded-lg"
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
