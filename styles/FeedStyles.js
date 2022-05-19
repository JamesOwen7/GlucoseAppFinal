import styled from 'styled-components';

export const Card = styled.View`
  background-color: #f1f1f1;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 10px;
`;

export const PostInfo = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  padding: 5px;
`;

export const PostTypeImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

export const PostInfoText = styled.View`
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
`;

export const PostName = styled.Text`
  font-size: 14px;
  font-weight: bold;
`;

export const PostTime = styled.Text`
  font-size: 12px;
  color: #666;
`;

export const PostText = styled.Text`
  font-size: 14px;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 5px;
`;

export const PostTextWater = styled.Text`
  font-size: 14px;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

export const PostImageContent = styled.Image`
  width: 100%;
  height: 250px;
  margin-top: 15px;
`;

export const Edit = styled.TouchableOpacity`
  justify-content: flex-start;
  align-items: flex-start;
  padding-left: 200px;
  left: 40px;
  bottom: 25px;
`;
